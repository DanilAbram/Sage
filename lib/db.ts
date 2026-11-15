import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Local SQLite file (data/sage.db), using Node's built-in sqlite (Node 22.5+).
// Fine for a single server; move to Postgres if you run several instances or a serverless host.
const g = globalThis as unknown as { __sageDb?: DatabaseSync };

export function db(): DatabaseSync {
  if (!g.__sageDb) {
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    const d = new DatabaseSync(path.join(dir, "sage.db"));
    d.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        pass TEXT NOT NULL,
        stripe_customer TEXT,
        sub_id TEXT,
        sub_status TEXT,
        created_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions(
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS searches(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        result TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_searches_user ON searches(user_id, id);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_customer ON users(stripe_customer) WHERE stripe_customer IS NOT NULL;
    `);
    g.__sageDb = d;
  }
  return g.__sageDb;
}

/** Keep only the newest `keep` searches for a user. */
export function trimHistory(userId: number, keep = 50) {
  db()
    .prepare(
      `DELETE FROM searches WHERE user_id = ? AND id NOT IN
       (SELECT id FROM searches WHERE user_id = ? ORDER BY id DESC LIMIT ?)`,
    )
    .run(userId, userId, keep);
}
