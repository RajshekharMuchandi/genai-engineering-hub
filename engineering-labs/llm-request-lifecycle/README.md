# Engineering Lab 001 — LLM Request Lifecycle

## Research Question

What actually happens between a user's request and the final response in a production-oriented LLM application?

## Objective

Build a small, provider-neutral application that demonstrates the responsibilities surrounding an LLM call:

- input validation
- prompt/context assembly
- model abstraction
- retry boundaries
- structured-output validation
- trace capture
- latency measurement
- failure handling
- deterministic tests

The lab intentionally uses a scripted model client so the core engineering lifecycle can be understood and tested without API keys, model costs, network dependencies, or provider-specific SDKs.

## Architecture

```text
User Input
    |
    v
Input Validation
    |
    v
Prompt Assembly
    |
    v
ModelClient Interface
    |
    v
Scripted Model
    |
    v
Structured Output Validation
    |
    v
Application Response
    |
    +--------------------+
    |                    |
    v                    v
Trace / Latency       Failure Result
```

## Why a Scripted Model?

The purpose of this lab is not to benchmark model intelligence.

It isolates the application lifecycle around the model so that:

1. positive and negative scenarios are deterministic,
2. retries can be forced,
3. malformed outputs can be tested,
4. application behavior is reproducible,
5. the same application service can later use an actual provider adapter.

## Run

From this directory:

```bash
python3 -m unittest discover -s tests -v
python3 -m lab.main
```

No third-party Python packages are required.

## Scenarios Covered

- valid user request
- blank user request
- context assembly
- successful structured output
- transient model failure followed by retry
- retry exhaustion
- malformed JSON response
- missing required response fields
- confidence outside the accepted range
- trace creation
- attempt counting
- latency capture

## Key Engineering Lesson

An LLM is one dependency inside an application.

Reliable GenAI systems require deterministic controls around probabilistic model behavior.

## Next Extension

The next version of this lab can introduce:

- real provider adapters
- token accounting
- timeouts
- backoff
- model routing
- prompt versioning
- OpenTelemetry tracing
- evaluation datasets
- cost measurement
