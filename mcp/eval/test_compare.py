import unittest
from compare import compare, new_probe_failures

def run(rows): return {"summary": {}, "rows": rows, "probes": []}

class Compare(unittest.TestCase):
    def test_a_case_that_falls_fails(self):
        b = run([{"query": "q", "expect": ["a"], "rank": 1}])
        a = run([{"query": "q", "expect": ["a"], "rank": 3}])
        self.assertEqual(compare(b, a, set())[0], ["q: 1 -> 3"])

    def test_a_case_that_disappears_fails(self):
        b = run([{"query": "q", "expect": ["a"], "rank": 2}])
        a = run([{"query": "q", "expect": ["a"], "rank": None}])
        self.assertEqual(compare(b, a, set())[0], ["q: 2 -> not found"])

    def test_only_cases_for_named_atoms_are_gated(self):
        b = run([{"query": "q", "expect": ["a"], "rank": 1}, {"query": "r", "expect": ["b"], "rank": 1}])
        a = run([{"query": "q", "expect": ["a"], "rank": 1}, {"query": "r", "expect": ["b"], "rank": 4}])
        self.assertEqual(compare(b, a, {"a"})[0], [])

    def test_only_a_probe_that_newly_fails_fails(self):
        b = {"summary": {}, "rows": [], "probes": [{"query": "p", "passed": False}, {"query": "q", "passed": True}]}
        a = {"summary": {}, "rows": [], "probes": [{"query": "p", "passed": False}, {"query": "q", "passed": False}]}
        self.assertEqual(new_probe_failures(b, a), ["q"])

if __name__ == "__main__":
    unittest.main()
