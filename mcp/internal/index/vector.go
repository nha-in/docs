package index

import (
	"database/sql"
	"encoding/binary"
	"math"
	"os"
)

func vecToBlob(v []float32) []byte {
	b := make([]byte, 4*len(v))
	for i, f := range v {
		binary.LittleEndian.PutUint32(b[4*i:], math.Float32bits(f))
	}
	return b
}

func blobToVec(b []byte) []float32 {
	v := make([]float32, len(b)/4)
	for i := range v {
		v[i] = math.Float32frombits(binary.LittleEndian.Uint32(b[4*i:]))
	}
	return v
}

// PreviousVectors reads the embeddings an earlier snapshot at dbPath already
// holds, keyed by chunk text, so a rebuild only embeds text that changed.
// Vectors are only reusable from the same model, so a snapshot built with
// another one, or no snapshot at all, yields an empty map and no error.
func PreviousVectors(dbPath, model string) (map[string][]float32, error) {
	out := map[string][]float32{}
	if _, err := os.Stat(dbPath); err != nil {
		return out, nil
	}
	db, err := sql.Open("sqlite", "file:"+dbPath+"?mode=ro")
	if err != nil {
		return out, err
	}
	defer db.Close()
	var prev string
	if err := db.QueryRow(`SELECT value FROM meta WHERE key='embedding_model'`).Scan(&prev); err != nil || prev != model {
		return out, nil
	}
	rows, err := db.Query(`SELECT text, embedding FROM chunks WHERE embedding IS NOT NULL`)
	if err != nil {
		return out, nil
	}
	defer rows.Close()
	for rows.Next() {
		var text string
		var blob []byte
		if err := rows.Scan(&text, &blob); err != nil {
			return out, err
		}
		out[text] = blobToVec(blob)
	}
	return out, rows.Err()
}
