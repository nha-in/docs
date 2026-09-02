package guard

import (
	"bytes"
	"encoding/json"
	"path"
	"regexp"
	"strings"
	"unicode/utf8"
)

// Masking an attached file.
//
// A pasted error body and an attached FHIR bundle are not the same problem.
// MaskPII works on shapes: it finds an Aadhaar number wherever it sits,
// because the number looks like itself. A patient's name does not look like
// anything, and no pattern over free text finds it without a language model,
// which is the reason Presidio pairs its regex recognisers with a spaCy
// model for names.
//
// A FHIR bundle does not need one. The field says what the value is:
// Patient.name, Patient.telecom, Patient.address, Patient.birthDate. So an
// attachment that parses as JSON is masked by its keys first, which catches
// exactly the identifiers a pattern cannot, and then by MaskPII, which
// catches the ones sitting in free text fields the keys do not name.
//
// What this cannot do is a name written in prose: "the bundle for Rakesh
// fails" stays as typed. That gap is real, it is the same gap Presidio fills
// with an NLP model, and no regex here closes it.

// sensitiveKeys maps a JSON field name, lowercased, to the placeholder its
// value is replaced with. FHIR's own field names and ABDM's account for
// almost all of it; the rest are the spellings that turn up in the request
// bodies integrators paste.
var sensitiveKeys = map[string]string{
	"name":           "NAME",
	"given":          "NAME",
	"family":         "NAME",
	"prefix":         "NAME",
	"suffix":         "NAME",
	"patientname":    "NAME",
	"guardianname":   "NAME",
	"fathername":     "NAME",
	"mothername":     "NAME",
	"spousename":     "NAME",
	"firstname":      "NAME",
	"middlename":     "NAME",
	"lastname":       "NAME",
	"telecom":        "CONTACT",
	"phone":          "CONTACT",
	"phonenumber":    "CONTACT",
	"mobile":         "CONTACT",
	"mobilenumber":   "CONTACT",
	"email":          "EMAIL",
	"emailid":        "EMAIL",
	"address":        "ADDRESS",
	"line":           "ADDRESS",
	"postalcode":     "ADDRESS",
	"pincode":        "ADDRESS",
	"birthdate":      "BIRTH_DATE",
	"dateofbirth":    "BIRTH_DATE",
	"dob":            "BIRTH_DATE",
	"yearofbirth":    "BIRTH_DATE",
	"photo":          "PHOTO",
	"healthid":       "ABHA_ADDRESS",
	"healthidnumber": "ABHA_NUMBER",
	"abhaaddress":    "ABHA_ADDRESS",
	"abhanumber":     "ABHA_NUMBER",
	"aadhaar":        "AADHAAR",
	"aadhar":         "AADHAAR",
}

// nestedValueParents are the objects whose "value" field carries the
// identifier itself. The parent is kept so a reader can still see what kind
// of identifier it was, which is usually the thing they are debugging.
var nestedValueParents = map[string]string{
	"identifier": "IDENTIFIER",
	"telecom":    "CONTACT",
}

// maskNode walks a decoded JSON document, replacing the values of sensitive
// fields with their placeholder. parent is the key the node hangs off, which
// is what tells an identifier's "value" apart from any other "value".
func maskNode(node any, key, parent string, note func(string)) any {
	switch v := node.(type) {
	case map[string]any:
		out := make(map[string]any, len(v))
		for k, child := range v {
			lower := strings.ToLower(k)
			if label, ok := sensitiveKeys[lower]; ok {
				note(label)
				out[k] = "<MASKED_" + label + ">"
				continue
			}
			if lower == "value" {
				if label, ok := nestedValueParents[strings.ToLower(parent)]; ok {
					note(label)
					out[k] = "<MASKED_" + label + ">"
					continue
				}
			}
			out[k] = maskNode(child, k, key, note)
		}
		return out
	case []any:
		out := make([]any, len(v))
		for i, child := range v {
			// An array does not change the field a value belongs to: every
			// entry of Patient.name is still a name.
			out[i] = maskNode(child, key, parent, note)
		}
		return out
	default:
		return node
	}
}

// MaskJSON masks an attachment that parses as JSON by its field names. The
// third return says whether it was JSON at all; when it was not, the text
// comes back untouched for MaskPII to handle on its own.
//
// The document is re-encoded, so object keys come back sorted and the
// original formatting is gone. That is a fair trade: what the model reads is
// the structure, and the reader still has their own file.
func MaskJSON(s string) (string, []string, bool) {
	var doc any
	if err := json.Unmarshal([]byte(s), &doc); err != nil {
		return s, nil, false
	}
	var found []string
	seen := map[string]bool{}
	note := func(label string) {
		if !seen[label] {
			seen[label] = true
			found = append(found, label)
		}
	}
	// Encoded rather than marshalled so the placeholders keep their angle
	// brackets: json.Marshal escapes them to \u003c, and half the document
	// would then read differently from the half MaskPII writes afterwards.
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(maskNode(doc, "", "", note)); err != nil {
		return s, nil, false
	}
	return strings.TrimRight(buf.String(), "\n"), found, true
}

// labelledNameRe finds a name that a line labels as one: "patient: Rakesh
// Sharma", "Name = Rakesh". This is the shape a name arrives in when the file
// is not JSON, which is most of the time once text has been read out of a
// screenshot or a log. It is a heuristic and narrow on purpose: these labels
// only, and only to the end of the line.
var labelledNameRe = regexp.MustCompile(`(?im)^([^\S\n]*(?:patient(?:'s)?(?: name)?|name|full name|given name|first name|last name|surname|guardian(?:'s)?(?: name)?|father(?:'s)?(?: name)?|mother(?:'s)?(?: name)?|spouse(?:'s)?(?: name)?)[^\S\n]*[:=][^\S\n]*)(\S.*)$`)

// typeWordRe spots a schema rather than a person. "name: string" in a
// specification is documentation, and masking it makes the file harder to
// read for no gain.
var typeWordRe = regexp.MustCompile(`(?i)^(string|str|text|integer|number|boolean|null|nil|none|object|array|required|optional|any|<[^>]*>|\{[^}]*\}|"")\s*[,;]?$`)

// maskLabelledNames replaces the value after a name label. Attachments only:
// in a question, "name:" is far more often a field being asked about than a
// person being named.
func maskLabelledNames(s string, note func()) string {
	return labelledNameRe.ReplaceAllStringFunc(s, func(line string) string {
		m := labelledNameRe.FindStringSubmatch(line)
		value := strings.TrimSpace(m[2])
		if typeWordRe.MatchString(value) || strings.HasPrefix(value, "<MASKED_") {
			return line
		}
		note()
		return m[1] + "<MASKED_NAME>"
	})
}

// MaskAttachment masks a file a reader attached to their question: by field
// name where the file is JSON, and by pattern always.
func MaskAttachment(s string) (string, []string) {
	text, found, isJSON := MaskJSON(s)
	if !isJSON {
		// With no field names to go by, the labels people write by hand
		// stand in for them.
		named := false
		text = maskLabelledNames(text, func() { named = true })
		masked, more := MaskPII(text)
		if named {
			return masked, append([]string{"NAME"}, more...)
		}
		return masked, more
	}
	masked, more := MaskPII(text)
	seen := map[string]bool{}
	for _, label := range found {
		seen[label] = true
	}
	for _, label := range more {
		if !seen[label] {
			found = append(found, label)
		}
	}
	return masked, found
}

// AttachmentName reduces a file name to something safe to repeat back: the
// base name only, so a path a browser should never have sent cannot travel
// into a prompt, and short enough not to crowd the question.
func AttachmentName(name string) string {
	clean := path.Base(strings.ReplaceAll(strings.TrimSpace(name), `\`, "/"))
	clean = strings.Map(func(r rune) rune {
		if r < 0x20 || r == '`' || r == '"' {
			return -1
		}
		return r
	}, clean)
	if clean == "" || clean == "." || clean == "/" {
		return "attachment"
	}
	if runes := []rune(clean); len(runes) > 80 {
		clean = string(runes[:80])
	}
	if !utf8.ValidString(clean) {
		return "attachment"
	}
	return clean
}
