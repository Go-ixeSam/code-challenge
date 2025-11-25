# Consistency in the Leaderboard System

## 1. The Problem
The system updates **PostgreSQL first**, then **Redis** for leaderboard ranking.  
If PostgreSQL succeeds but Redis fails, the two data sources diverge, causing **incorrect scores or ranks** to appear on the leaderboard.

## 2. Why It Matters
- PostgreSQL holds the **correct, authoritative score**.  
- Redis is only a **fast cache** for ranking.

When they fall out of sync, users may see outdated totals, incorrect ranks, and unreliable realtime updates.

## 3. Solution (Based on the Original Design)
To keep PostgreSQL and Redis aligned:

- Use a **single PostgreSQL transaction** for updating `user_scores` and logging `score_events`, ensuring the database state is always correct.  
- After the DB commit, **retry Redis updates** to handle temporary Redis failures.  
- If Redis still cannot be updated, **record the failed update (pending sync)** so it can be retried later until Redis fully matches the authoritative DB score.

## A diagram for clear vision
[`consistency.png`](./diagram/consistency.png)