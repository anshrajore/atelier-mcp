import express from 'express';

const app = express();
app.use(express.json());

// Violation BE-201: Hardcoded fallback secret
const JWT_SECRET = process.env.JWT_SECRET || "default_insecure_super_secret_jwt_token_123";

// Mock DB
const db: any = {};

// Violation BE-202: Direct unvalidated body consumption
// Violation BE-203: No rate limiting on authentication endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await db.users.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({ token: 'mock-jwt-token' });
});

// Violation BE-204: N+1 query loop fetching posts per user
// Violation BE-205: Unbounded collection query
app.get('/api/users/overview', async (req, res) => {
  // Unbounded query
  const users = await db.users.findMany();

  // N+1 Query in loop
  const results = [];
  for (const user of users) {
    const posts = await db.posts.findMany({ where: { userId: user.id } });
    results.push({ ...user, posts });
  }

  return res.json(results);
});

export default app;
