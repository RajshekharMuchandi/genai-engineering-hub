from __future__ import annotations

import json
import unittest

from lab.client import ScriptedModelClient
from lab.errors import ResponseValidationError, TransientModelError
from lab.prompting import build_prompt
from lab.service import LlmApplicationService


class PromptTests(unittest.TestCase):
    def test_blank_user_input_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            build_prompt("   ")

    def test_context_is_added_to_prompt(self) -> None:
        prompt = build_prompt(
            "Explain retrieval",
            ["Document A is current", "Document B is archived"],
        )

        self.assertIn("Explain retrieval", prompt)
        self.assertIn("- Document A is current", prompt)
        self.assertIn("- Document B is archived", prompt)

    def test_missing_context_is_explicit(self) -> None:
        prompt = build_prompt("Explain agents")

        self.assertIn(
            "- No additional context supplied",
            prompt,
        )


class LifecycleTests(unittest.TestCase):
    def test_valid_response_is_returned_with_trace(self) -> None:
        client = ScriptedModelClient(
            [
                json.dumps(
                    {
                        "answer": "Use deterministic controls.",
                        "confidence": 0.9,
                    }
                )
            ]
        )
        service = LlmApplicationService(client)

        result = service.handle("How should we wrap an LLM?")

        self.assertEqual(
            "Use deterministic controls.",
            result.response.answer,
        )
        self.assertEqual(0.9, result.response.confidence)
        self.assertEqual(1, result.trace.attempts)
        self.assertGreaterEqual(result.trace.latency_ms, 0)
        self.assertGreater(result.trace.input_characters, 0)
        self.assertGreater(result.trace.output_characters, 0)
        self.assertIn(
            "response_validated",
            result.trace.events,
        )

    def test_transient_failure_is_retried(self) -> None:
        client = ScriptedModelClient(
            [
                TransientModelError("temporary provider failure"),
                json.dumps(
                    {
                        "answer": "Recovered.",
                        "confidence": 0.8,
                    }
                ),
            ]
        )
        service = LlmApplicationService(
            client,
            max_attempts=2,
        )

        result = service.handle("Retry this request")

        self.assertEqual("Recovered.", result.response.answer)
        self.assertEqual(2, result.trace.attempts)
        self.assertEqual(2, len(client.calls))
        self.assertIn(
            "transient_model_error",
            result.trace.events,
        )

    def test_retry_exhaustion_propagates_failure(self) -> None:
        client = ScriptedModelClient(
            [
                TransientModelError("failure one"),
                TransientModelError("failure two"),
            ]
        )
        service = LlmApplicationService(
            client,
            max_attempts=2,
        )

        with self.assertRaises(TransientModelError):
            service.handle("This must fail")

        self.assertEqual(2, len(client.calls))

    def test_malformed_json_is_rejected(self) -> None:
        client = ScriptedModelClient(["not-json"])
        service = LlmApplicationService(client)

        with self.assertRaises(ResponseValidationError):
            service.handle("Return malformed JSON")

    def test_missing_answer_is_rejected(self) -> None:
        client = ScriptedModelClient(
            [json.dumps({"confidence": 0.7})]
        )
        service = LlmApplicationService(client)

        with self.assertRaises(ResponseValidationError):
            service.handle("Missing answer")

    def test_missing_confidence_is_rejected(self) -> None:
        client = ScriptedModelClient(
            [json.dumps({"answer": "Hello"})]
        )
        service = LlmApplicationService(client)

        with self.assertRaises(ResponseValidationError):
            service.handle("Missing confidence")

    def test_out_of_range_confidence_is_rejected(self) -> None:
        client = ScriptedModelClient(
            [
                json.dumps(
                    {
                        "answer": "Impossible confidence",
                        "confidence": 1.5,
                    }
                )
            ]
        )
        service = LlmApplicationService(client)

        with self.assertRaises(ResponseValidationError):
            service.handle("Bad confidence")

    def test_boolean_confidence_is_rejected(self) -> None:
        client = ScriptedModelClient(
            [
                json.dumps(
                    {
                        "answer": "Boolean is not a score",
                        "confidence": True,
                    }
                )
            ]
        )
        service = LlmApplicationService(client)

        with self.assertRaises(ResponseValidationError):
            service.handle("Boolean confidence")


if __name__ == "__main__":
    unittest.main()
