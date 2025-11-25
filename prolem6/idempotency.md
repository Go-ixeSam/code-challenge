# Idempotency in the Leaderboard System

## 1. The Problem
A user action may be **sent multiple times** due to network retries, refreshes, double-clicks, or client-side resubmissions.  
If the backend increments the score on every repeated request, the user may receive **duplicate points**, resulting in incorrect totals and ranking.

## 2. Why It Matters
The scoring pipeline must guarantee that **each logical action affects the score exactly once**.  
Without idempotency:
- Users can gain extra points unintentionally  
- Leaderboard ordering becomes inaccurate  
- Data in PostgreSQL and Redis becomes inflated and unreliable  

Even with retries or repeated client calls, the backend must maintain the same final result.

## 3. Solution (Based on the Original Design)
To prevent duplicate score increments:

- Generate or accept a **unique request identifier** for each scoring action.  
- Ensure the backend processes each unique action **only once**, ignoring duplicates.  
- Store processed action identifiers (or sequence counters) so that retries cannot apply the same score multiple times.

With idempotency in place, the system ensures that:
**retrying a scoring request never alters the final score more than once.**

## A diagram for clear vision
[`idempotency.png`](./diagram/idempotency.png)
