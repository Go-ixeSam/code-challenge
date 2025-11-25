# 🏆 Realtime Leaderboard Module — Clean Architecture (NestJS + PostgreSQL + Redis)

## 1. Problem Statement

Build a realtime leaderboard system capable of:

- Receiving actions from users  
- Calculating points based on actionType stored in the database  
- Updating scores in PostgreSQL
- Syncing scores to Redis ZSET for fast rank/top queries  
- Displaying the top 10 players  
- Sending realtime updates to clients  
- Storing score history  
- Preventing clients from tampering with score values

## 2. Assumptions

- Points for each action are defined in the `action_types` table.  
- Users send **actionType only**, never raw points.  
- PostgreSQL is the **source of truth** for user scores.  
- Redis ZSET is used only for leaderboard ranking, not score calculation.  
- Clients authenticate via JWT.  
- Realtime delivery (WebSocket ) will be chosen later.  
- Improvements regarding consistency & idempotency are documented separately:
  - `consistency.md`
  - `idempotency.md`

## 3. Architecture Overview

### Technology Stack
- NestJS  
- PostgreSQL  
- Redis ZSET  
- JWT  
- WebSocket (or other realtime layer)

### System Architecture Diagram  
[`system_architecture.png`](../prolem6/diagram/system_architecture.png)

## 4. Execution Flow (Backend-Centric Scoring Logic)

Sequence Diagram:  
[`sequence_diagram.png`](../prolem6/diagram/sequence_diagram.png)

Standard scoring pipeline:

1. Client sends **actionType**  
2. Backend validates JWT → obtains userId  
3. Backend looks up points from `action_types`  
4. Backend updates score in DB (`user_scores`)  
5. Backend records the event in `score_events`  
6. Backend syncs the score to Redis using `ZINCRBY`  
7. Backend retrieves rank using `ZREVRANK`  
8. Backend pushes realtime update to clients  

## 5. Data Model

ERD link:  
[`erd.png`](../prolem6/diagram/erd.png)

### Core Tables
#### `action_types`
- action_type  
- points  
- description  

#### `user_scores`
- user_id  
- total_score  

#### `score_events`
- id  
- user_id  
- action_type  
- delta_points  
- created_at  

## 6. Leaderboard Logic (Redis)

Redis uses a ZSET named `leaderboard`:

- Increase score:  
  ```
  ZINCRBY leaderboard <points> <userId>
  ```

- Get rank:  
  ```
  ZREVRANK leaderboard <userId>
  ```

- Get top 10:  
  ```
  ZREVRANGE leaderboard 0 9 WITHSCORES
  ```

## 7. API Endpoints

### POST /scores/increment
Accepts an actionType and returns updated score & rank.

Request:
```json
{
  "actionType": "kill_monster"
}
```

Response:
```json
{
  "userId": "uuid",
  "score": 123,
  "rank": 9
}
```

### GET /scores/top  
Returns the top 10 users from Redis.

### GET /scores/:userId  
Returns current score & rank for the specified user.

## 8. Improvements (Links Only)

- **Consistency**  
  → [`consistency.md`](./consistency.md)

- **Idempotency**  
  → [`idempotency.md`](./idempotency.md)
