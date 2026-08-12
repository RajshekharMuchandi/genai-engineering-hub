from __future__ import annotations

from collections import deque
from typing import Protocol


class ModelClient(Protocol):
    def generate(self, prompt: str) -> str:
        """Return raw model output for a prompt."""


class ScriptedModelClient:
    """Deterministic model client for repeatable engineering tests.

    Each call consumes the next scripted item. An item may be either:
    - a string response, or
    - an Exception instance to raise.
    """

    def __init__(self, scripted_results: list[str | Exception]) -> None:
        if not scripted_results:
            raise ValueError("scripted_results must contain at least one item")

        self._results = deque(scripted_results)
        self.calls: list[str] = []

    def generate(self, prompt: str) -> str:
        self.calls.append(prompt)

        if not self._results:
            raise RuntimeError("No scripted model result remains")

        result = self._results.popleft()

        if isinstance(result, Exception):
            raise result

        return result
