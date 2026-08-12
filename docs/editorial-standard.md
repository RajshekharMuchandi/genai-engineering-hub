# Editorial Standard

The GenAI Engineering Hub exists to demonstrate engineering capability through evidence.

## Core Principle

Build → Measure → Explain

## Every Article Should Add Original Value

At least one of the following should be present:

- original architecture
- original implementation
- original experiment
- original benchmark
- original diagram
- failure analysis
- comparison
- production experience
- engineering trade-off analysis
- reproducible example

Articles that merely summarize existing documentation should generally not be published.

## Explain Decisions, Not Just Steps

Weak:

"Install pgvector and store embeddings."

Strong:

"Use pgvector because the operational simplicity of keeping metadata and embeddings in PostgreSQL outweighs the retrieval scalability benefits of a dedicated vector database at the expected workload."

The reasoning is more valuable than the command.

## Discuss Failure

Production systems fail.

Where relevant, explain:

- what can fail
- how failure is detected
- what users experience
- retry behaviour
- fallback behaviour
- recovery
- observability

## Include Trade-offs

Avoid presenting one architecture as universally correct.

Discuss:

- alternatives
- advantages
- disadvantages
- operational complexity
- cost
- performance
- lock-in
- scalability

## Separate Evidence From Opinion

Clearly distinguish:

- measured result
- observed behaviour
- documented behaviour
- architectural recommendation
- personal engineering judgement

## Avoid Artificial Expertise

Do not claim production experience for experimental systems.

Use the evidence classification defined in `docs/content-model.md`.

## Prefer Primary Sources

For rapidly changing technologies use:

1. official specifications
2. official documentation
3. research papers
4. official engineering publications
5. reputable secondary sources when necessary

## Keep Technical Claims Verifiable

Add `lastVerifiedAt` when external behaviour or specifications can change.

## Code Quality

Code shown in articles should aim to be:

- runnable
- tested
- secure
- documented
- production-conscious

Avoid code that works only as a superficial demo unless explicitly labelled as such.

## Diagrams

Architecture articles should use diagrams where they improve understanding.

Preferred source-controlled formats:

- Mermaid
- PlantUML
- diagrams-as-code

Images may be used when appropriate.

## Portfolio Principle

The objective is not to tell readers that the author is an expert.

The objective is to provide enough engineering evidence that readers reach that conclusion themselves.
