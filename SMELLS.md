# reservation-service: Smells and One Fix

Fill in each section. One section per milestone. Keep it short and specific. Point at files
and methods, not adjectives.

---

## Milestone 1: Three smells

Three smells, each in a different part of the module. For each one, fill in all five parts.

### Smell 1

**The smell:** God Class

**Classic or agent-specific.** Classic

**Where in the code.** reservationManager.ts

**The principle it violates.** High cohesion / single responsibility

**What it makes expensive.** High maintence risk changing things like receipt layout, pricing rules, etc. requires modifying the same class, expanding the review. It can also become harder to test.

### Smell 2

**The smell:** Duplication over reuse

**Classic or agent-specific:** Agent-specific, it fits missing context by rebuilding an existing rule instead of reusing it.

**Where in the code.** calculatePrice() and applyDiscounts() in reservationManager.ts and priceOf() and in reportGenerator.ts

**The principle it violates:** Information Hiding

**What it makes expensive:** Changing the evening discount requires synchronized edits, if you change how you calculate the price in one area, you must make sure the stays consistent in all other areas.

### Smell 3

**The smell:** Hidden dependencies

**Classic or agent-specific:** Classic, one the five errors

**Where in the code:** ReservationManager

**The principle it violates:**

**What it makes expensive:** It accepts storage explicitly, but creates its own notifier using shared default configuration and a mutable module-level registry. So, a user cannot directly provide a test notifier, making testing notification failures much more difficult.

---

## Milestone 2: One small fix

One fix, behavior preserved, suite green, zero test edits.

**Which smell you attacked:** Hidden dependencies because it was straightforward and would change the least amount of code across files

**What changed.** reservationManager.ts and constructor. I passed in the cache and notifier alongside the storage. This makes the dependencies explicit and controllable. While the notifier still uses the shared registry, callers can now bypass it without modifying global state.

**What you deliberately did not touch.** I just wanted to change something in reservationManager.ts since that was where most of the problems were.

**How you know behavior is preserved.** The suite is still green, it runs the tests and makes sure everything typechecks. If I added a new function/property and didn't write any new tests for that property, as long as it didn't interfere with the previous code, the suite wouldn't catch any bugs. 

---

## Milestone 3: Two proposals and one false positive


### Proposal A (not coded)

**The problem.** God class

**The decomposition.** Keep ReservationManager responsible for coordinating booking creation and cancellation. Move pricing calculations into a pricing module that owns premium surcharges, discounts, and rounding. Move formatReceipt(), formatDailySummary(), and their clock/money helpers into a formatter that owns presentation rules. Keep message delivery in the existing notification channel, with the manager calling it during booking operations.

**One cost.** Formatting currently just lives in the manager’s room registry and bookings directly. After moving it to a new class, the manager must pass that information to the formatter. This introduces interfaces and data passing which can add complexity. 

### Proposal B (not coded)

**The problem:** Duplication 

**The decomposition:** Create one shared calculatePrice(room, start, end) function and put it in a pricing module. Move all pricing constants, discount conditions, and rounding rules there. Both ReservationManager.calculatePrice() and ReportGenerator.priceOf() now just call that function instead of implementing their own calculations. The manager owns booking creation, the report generator owns aggregation, and the pricing module is the single owner of pricing policy.

**One cost:** Booking creation and reporting now depend on the same pricing module. If there is a mistake in that function it will now effect both, so pricing changes need verification in both contexts.

### The thing that looks smelly but is fine

**What it is.** validateReservationRequest() in src/validation.ts contains many checks and could initially look like a long-method smell.

**Why it is fine.** All the checks serve one cohesive responsibility: deciding whether a reservation request is valid for a room. The function uses explicit inputs, has no side effects, and follows a straightforward sequence of early returns. Its length comes from individual validation rules, rather than unrelated responsibilities.

**What would flip your verdict.** If different buildings had varying rules (ex. opening hours, duration limits, or premium-room policies), then they would need their own policy functions or objects.
