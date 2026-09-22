# reservation-service: Smells and One Fix

Fill in each section. One section per milestone. Keep it short and specific. Point at files
and methods, not adjectives.

---

## Milestone 1: Three smells

Three smells, each in a different part of the module. For each one, fill in all five parts.

### Smell 1

**The smell.** Name it, using the vocabulary from lecture.

**Classic or agent-specific.** Which, and why that label. For agent-specific, say which of
the lecture's three causes produced it.

**Where in the code.** File and, where there is one, method.

**The principle it violates.** Name the principle. "This is too big" is not a principle.

**What it makes expensive.** A concrete future change, or something that already goes wrong
today. What breaks first?

### Smell 2

**The smell.**

**Classic or agent-specific.**

**Where in the code.**

**The principle it violates.**

**What it makes expensive.**

### Smell 3

**The smell.**

**Classic or agent-specific.**

**Where in the code.**

**The principle it violates.**

**What it makes expensive.**

---

## Milestone 2: One small fix

One fix, behavior preserved, suite green, zero test edits.

**Which smell you attacked.** And why that one.

**What changed.** Files and methods you touched, and what the code does differently now.

**What you deliberately did not touch.** Name the scope line you drew and why you drew it
there. "I ran out of time" is not a scope line.

**How you know behavior is preserved.** Point at the suite, say what it actually covers, and
say what it would not catch.

---

## Milestone 3: Two proposals and one false positive

One proposal for each milestone 1 smell you did not fix.

### Proposal A (not coded)

**The problem.** Name it.

**The decomposition.** What are the pieces, what does each own, and where do the rules live?

**One cost.** Something this actually costs. "No real downside" is not a cost.

### Proposal B (not coded)

**The problem.**

**The decomposition.**

**One cost.**

### The thing that looks smelly but is fine

**What it is.** File and method.

**Why it is fine.** Defend it with properties of the code, not with its line count.

**What would flip your verdict.** Name the change that would turn this into a real problem.
