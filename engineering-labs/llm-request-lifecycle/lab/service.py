from __future__ import annotations

from time import perf_counter

from lab.client import ModelClient
from lab.errors import TransientModelError
from lab.models import ApplicationResult, RequestTrace
from lab.prompting import build_prompt
from lab.validation import parse_application_response


class LlmApplicationService:
    """Application boundary around a model client.

    The service owns deterministic application concerns while the
    model client owns raw model generation.
    """

    def __init__(
        self,
        model_client: ModelClient,
        max_attempts: int = 2,
    ) -> None:
        if max_attempts < 1:
            raise ValueError("max_attempts must be at least 1")

        self._model_client = model_client
        self._max_attempts = max_attempts

    def handle(
        self,
        user_input: str,
        context: list[str] | None = None,
    ) -> ApplicationResult:
        prompt = build_prompt(user_input, context)

        started = perf_counter()
        events: list[str] = ["prompt_built"]
        attempts = 0
        raw_output = ""

        while attempts < self._max_attempts:
            attempts += 1
            events.append(f"model_attempt_{attempts}")

            try:
                raw_output = self._model_client.generate(prompt)
                events.append("model_response_received")
                break
            except TransientModelError:
                events.append("transient_model_error")

                if attempts >= self._max_attempts:
                    events.append("retry_exhausted")
                    raise

        response = parse_application_response(raw_output)
        events.append("response_validated")

        elapsed_ms = (perf_counter() - started) * 1000

        trace = RequestTrace(
            prompt=prompt,
            attempts=attempts,
            latency_ms=elapsed_ms,
            input_characters=len(prompt),
            output_characters=len(raw_output),
            events=tuple(events),
        )

        return ApplicationResult(
            response=response,
            trace=trace,
        )
