from __future__ import annotations

import json

from lab.client import ScriptedModelClient
from lab.service import LlmApplicationService


def main() -> None:
    client = ScriptedModelClient(
        [
            json.dumps(
                {
                    "answer": (
                        "A production LLM application wraps the model "
                        "with validation, context, failure handling, "
                        "structured outputs and observability."
                    ),
                    "confidence": 0.95,
                }
            )
        ]
    )

    service = LlmApplicationService(client)

    result = service.handle(
        "What makes an LLM application production-oriented?",
        context=[
            "Models are probabilistic dependencies.",
            "Application controls should remain deterministic where possible.",
        ],
    )

    print("ANSWER")
    print(result.response.answer)
    print()
    print("CONFIDENCE")
    print(result.response.confidence)
    print()
    print("TRACE")
    print(f"attempts={result.trace.attempts}")
    print(f"latency_ms={result.trace.latency_ms:.3f}")
    print(f"input_characters={result.trace.input_characters}")
    print(f"output_characters={result.trace.output_characters}")
    print(f"events={list(result.trace.events)}")


if __name__ == "__main__":
    main()
