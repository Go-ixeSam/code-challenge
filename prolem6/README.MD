# Game Leaderboard Module Specification (NestJS)

This document fully describes the **Realtime Game Leaderboard** module built with NestJS, PostgreSQL, Redis, and WebSocket.
The system follows a scoring pipeline: player performs action → backend calculates points → updates DB → updates Redis leaderboard → pushes realtime updates to clients.

Goal: fast – simple – anti-cheat – extensible – realtime.

---

# 1. Overview

This module handles the entire scoring pipeline:

- Backend **calculates score** using the `action_types` table.
- PostgreSQL stores the **source of truth** player scores.
- Redis ZSET maintains the **realtime leaderboard**.
- WebSocket broadcasts updates to connected clients.
- JWT ensures valid player authentication.
- Basic anti-cheat: client never sends delta, only sends actionType.

---

# 2. Objectives

- Accept valid game actions from the client.  
- Validate permissions & user identity via JWT.  
- Lookup point values from `action_types`.  
- Update the `user_scores` table.  
- Update Redis ZSET leaderboard.  
- Emit WebSocket events to all clients.  
- Keep Auth module and Scoreboard module fully separated.  
- Allow admin to define new actions (via DB).  
- Log every action via `score_events`.

---

# 3. System Architecture (PlantUML)
  Open system_architecture.png
---
 
# 4. Data Model (ERD in PlantUML)
  Open erd.png
---

# 5. Execution Flow — From Game Action → Leaderboard Update (PlantUML)
  Open sequence_diagram.png
---

# 6. Module Responsibilities

## 6.1 Scoreboard API
- Receive `actionType`  
- Validate action  
- Lookup point value in DB  
- Update DB + Redis  
- Emit WebSocket updates  
- Return updated score & rank  

## 6.2 Auth Module
- Validate JWT  
- Completely separated from scoreboard logic  
- Does not rely on `user_scores` for authentication  

## 6.3 WebSocket Gateway
- Broadcast `scoreboard:update` events  
- Push updated score & rank to all clients  

## 6.4 Redis Leaderboard
- `ZINCRBY leaderboard <points> <userId>`  
- `ZREVRANK` to get rank  
- `ZRANGE` to fetch top 10  

---

# 7. API Specifications

## POST /scores/increment

**Headers**
```
Authorization: Bearer <jwt>
```

**Body**
```json
{
  "actionType": "kill_monster"
}
```

**Response**
```json
{
  "userId": "uuid",
  "score": 123,
  "rank": 9
}
```

---

## GET /scores/top  
Return top 10 players from Redis.

---

## GET /scores/:userId  
Return current rank & score for the user.

---

# 8. Action Type Definition

| action_type       | points | description         |
|------------------|--------|---------------------|
| kill_monster     | 3      | Kill a normal mob   |
| kill_boss        | 20     | Defeat a boss       |
| assist_teammate  | 1      | Assist a teammate   |
| complete_stage   | 10     | Complete a stage    |
| login_daily      | 2      | Daily login reward  |

---

# 9. Security & Anti-cheat

- JWT authentication  
- Client **never** sends score delta  
- Server looks up point values  
- Rate limiting  
- Whitelisted action types  
- Full audit via `score_events`  
- HTTPS required  

---

# 10. Module Logic Breakdown

1. Receive action  
2. Lookup point value  
3. Write to DB  
4. Update Redis leaderboard  
5. Emit realtime event  
6. Anti-cheat validation  

---
# Improvements are needed
To ensure **data correctness** and **safety** within the leaderboard system, every score update must be processed in a way that prevents partial writes, duplication, and inconsistent states. This starts with using a **database transaction**, which guarantees that score updates and event logs are committed atomically—either fully applied or not applied at all. Once the database is successfully updated, **Redis retry** is required to keep the leaderboard cache consistent, even when Redis experiences temporary failures. Finally, **idempotency** ensures that repeated or retried requests never cause duplicate score increments, protecting the system from double writes caused by network instability or client resubmissions. Together, these mechanisms maintain a reliable, accurate, and safe scoring pipeline where data remains consistent across both the database and Redis. 

You can check [consistency.md](./consistency.md) and [idempotency.md](./idempotency.md) to ensure data correctness.
