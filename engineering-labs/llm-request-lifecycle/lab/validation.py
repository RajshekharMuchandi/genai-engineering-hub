from __future__ import annotations

import json
from typing import Any

from lab.errors import ResponseValidationError
from lab.models import ApplicationResponse


def parse_application_response(raw_output: str) -> ApplicationResponse:
    try:
        payload: Any = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ResponseValidationError(
            "Model response is not valid JSON"
        ) from exc

    if not isinstance(payload, dict):
        raise ResponseValidationError(
            "Model response must be a JSON object"
        )

    answer = payload.get("answer")
    confidence = payload.get("confidence")

    if not isinstance(answer, str) or not answer.strip():
        raise ResponseValidationError(
            "Model response requires a non-empty string 'answer'"
        )

    if isinstance(confidence, bool) or not isinstance(
        confidence, (int, float)
    ):
        raise ResponseValidationError(
            "Model response requires numeric 'confidence'"
        )

    confidence_value = float(confidence)

    if not 0.0 <= confidence_value <= 1.0:
        raise ResponseValidationError(
            "Model response confidence must be between 0 and 1"
        )

    return ApplicationResponse(
        answer=answer.strip(),
        confidence=confidence_value,
    )
