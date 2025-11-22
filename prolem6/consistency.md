# Leaderboard Consistency (Monolith Architecture)
## 1. Problem

Normal pipeline:

```
Update DB → Update Redis → Emit WebSocket
```

If Redis fails during update:

- DB already increased the score  
- Redis did not  
- Player sees wrong score or rank  
- Data becomes permanently inconsistent if not fixed manually  

---

## 2. Solution Overview

The solution uses three components:

### **2.1 Database Transaction**
All DB operations are wrapped in a single transaction:

- `UPDATE user_scores`
- `INSERT score_events`

This ensures the database is always correct and never partially updated.

---

### **2.2 Redis Retry**
After the DB transaction commits:

- Attempt Redis update  
- Retry up to 3 times  
- Use light backoff  

This handles most temporary network or Redis hiccups.

---

### **2.3 pending_redis_sync Table + Cron Job**
If all Redis retries fail:

1. Store a record in `pending_redis_sync`
2. A cron job runs every second:
   - Reads pending records  
   - Attempts Redis update again  
   - On success → delete the record  
   - On failure → increase retry_count  

This keeps Redis **eventually consistent** with the database, even if Redis is down for several minutes.

---

## 3. pending_redis_sync Table

```sql
CREATE TABLE pending_redis_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  delta_points INT NOT NULL,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Stores failed Redis updates so they can be retried safely.

---

## 4. Full Workflow

```
[1] DB Transaction
[2] Commit
[3] Redis Retry (3 attempts)
      → Success → Emit WebSocket
      → Failure → Insert into pending_redis_sync
[4] Cron Job retries failed Redis updates
```

---

## 5. Benefits

- No score is ever lost  
- Redis remains eventually consistent with PostgreSQL  
- System self‑heals when Redis recovers  
- No message brokers or microservices required  
- A clean, reliable monolith design  

