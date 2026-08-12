class LlmLifecycleError(Exception):
    """Base exception for the lab."""


class TransientModelError(LlmLifecycleError):
    """A retryable model/provider failure."""


class ResponseValidationError(LlmLifecycleError):
    """The model response cannot be accepted by the application."""
