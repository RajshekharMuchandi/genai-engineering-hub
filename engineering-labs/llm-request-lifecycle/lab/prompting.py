from __future__ import annotations


SYSTEM_INSTRUCTION = """You are an enterprise assistant.
Answer using the supplied context when relevant.
Return JSON only with this exact structure:
{"answer": "<text>", "confidence": <number between 0 and 1>}
"""


def build_prompt(
    user_input: str,
    context: list[str] | None = None,
) -> str:
    normalized_input = user_input.strip()

    if not normalized_input:
        raise ValueError("user_input must not be blank")

    context_items = [
        item.strip()
        for item in (context or [])
        if item and item.strip()
    ]

    context_block = (
        "\n".join(f"- {item}" for item in context_items)
        if context_items
        else "- No additional context supplied"
    )

    return (
        f"{SYSTEM_INSTRUCTION}\n"
        f"CONTEXT:\n{context_block}\n\n"
        f"USER REQUEST:\n{normalized_input}\n"
    )
