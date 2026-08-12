from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class ApplicationResponse:
    answer: str
    confidence: float


@dataclass(frozen=True)
class RequestTrace:
    prompt: str
    attempts: int
    latency_ms: float
    input_characters: int
    output_characters: int
    events: tuple[str, ...] = field(default_factory=tuple)


@dataclass(frozen=True)
class ApplicationResult:
    response: ApplicationResponse
    trace: RequestTrace
