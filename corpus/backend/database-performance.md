# Database Safety, Efficiency & Query Patterns

## 1. The N+1 Query Problem
An N+1 query problem occurs when an application fetches 1 record and then executes N subsequent queries in a loop to fetch related child entities.

```typescript
// INEFFICIENCY (N+1):
const users = await db.user.findMany();
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } }); // N queries!
}

// BATCHED (1 or 2 queries):
const usersWithPosts = await db.user.findMany({
  include: { posts: true }
});
```

## 2. Unbounded Collections & Pagination
Never query collections without pagination boundaries:
- Enforce strict defaults: `limit = Math.min(Number(req.query.limit) || 20, 100)`.
- Use cursor-based pagination for high-volume or real-time tables to prevent `OFFSET` performance degradation.
- Index all foreign key columns used in `WHERE`, `JOIN`, and `ORDER BY` clauses.
