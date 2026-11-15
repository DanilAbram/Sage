// Database access for Sage.
// - Online (Vercel): Postgres, when DATABASE_URL (or POSTGRES_URL) is set, e.g. Neon from the Vercel Marketplace.
// - Local development: a SQLite file at data/sage.db (Node's built-in sqlite), when no database URL is set.
// Queries are written once with `?` placeholders and work on both.
import type { Pool } from "pg";

type Params = (string | number | null)[];
type Driver = {
  all<T>(sql: string, params: Params): Promise<T[]>;
  run(sql: string, params: Params): Promise<void>;
};

const PG_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    pass TEXT NOT NULL,
    stripe_customer TEXT,
    sub_id TEXT,
    sub_status TEXT,
    created_at BIGINT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions(
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at BIGINT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS searches(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at BIGINT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS rate_hits(
    key TEXT NOT NULL,
    at BIGINT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_searches_user ON searches(user_id, id);
  CREATE INDEX IF NOT EXISTS idx_rate_hits ON rate_hits(key, at);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_customer ON users(stripe_customer) WHERE stripe_customer IS NOT NULL;
`;

const SQLITE_SCHEMA = `
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
  CREATE TABLE IF NOT EXISTS rate_hits(
    key TEXT NOT NULL,
    at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_searches_user ON searches(user_id, id);
  CREATE INDEX IF NOT EXISTS idx_rate_hits ON rate_hits(key, at);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_customer ON users(stripe_customer) WHERE stripe_customer IS NOT NULL;
`;

const databaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

/** `?` placeholders → `$1, $2, …` for Postgres (our SQL never contains a literal "?"). */
const toPg = (sql: string) => {
  let n = 0;
  return sql.replace(/\?/g, () => `$${++n}`);
};

async function makePg(url: string): Promise<Driver> {
  const pg = await import("pg");
  // BIGINT columns hold millisecond timestamps, which fit safely in a JS number
  pg.types.setTypeParser(20, (v: string) => Number(v));
  const local = /localhost|127\.0\.0\.1/.test(url);
  const pool: Pool = new pg.Pool({
    connectionString: url,
    max: Number(process.env.PG_POOL_MAX) || 5,
    idleTimeoutMillis: 10_000,
    ssl: local || /sslmode=disable/.test(url) ? undefined : { rejectUnauthorized: true },
  });
  // create tables once; two cold starts racing on CREATE can collide, so retry once
  for (let attempt = 0; ; attempt++) {
    try {
      await pool.query(PG_SCHEMA);
      break;
    } catch (e) {
      if (attempt >= 2) throw e;
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return {
    async all<T>(sql: string, params: Params) {
      return (await pool.query(toPg(sql), params)).rows as T[];
    },
    async run(sql: string, params: Params) {
      await pool.query(toPg(sql), params);
    },
  };
}

async function makeSqlite(): Promise<Driver> {
  const { DatabaseSync } = await import("node:sqlite");
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const d = new DatabaseSync(path.join(dir, "sage.db"));
  d.exec(SQLITE_SCHEMA);
  return {
    async all<T>(sql: string, params: Params) {
      return d.prepare(sql).all(...params) as T[];
    },
    async run(sql: string, params: Params) {
      d.prepare(sql).run(...params);
    },
  };
}

const g = globalThis as unknown as { __sageDriver?: Promise<Driver> };

function driver(): Promise<Driver> {
  if (!g.__sageDriver) {
    const url = databaseUrl();
    if (!url && process.env.VERCEL) {
      // Vercel can't keep a database file: connect Neon (Storage tab) so DATABASE_URL is set
      return Promise.reject(new Error("No database: add Neon Postgres in Vercel → Storage, then redeploy."));
    }
    g.__sageDriver = (url ? makePg(url) : makeSqlite()).catch((e) => {
      g.__sageDriver = undefined; // let the next request try again
      throw e;
    });
  }
  return g.__sageDriver;
}

/** All rows. */
export async function all<T>(sql: string, ...params: Params): Promise<T[]> {
  return (await driver()).all<T>(sql, params);
}
/** First row, or undefined. */
export async function one<T>(sql: string, ...params: Params): Promise<T | undefined> {
  return (await all<T>(sql, ...params))[0];
}
/** Run a statement that returns nothing. */
export async function run(sql: string, ...params: Params): Promise<void> {
  return (await driver()).run(sql, params);
}

/** True when an error is a unique-constraint violation (duplicate email, etc.) on either database. */
export function isUniqueViolation(e: unknown) {
  const code = (e as { code?: string } | null)?.code;
  return code === "23505" || /UNIQUE constraint/i.test(String(e));
}

/** Keep only the newest `keep` searches for a user. */
export async function trimHistory(userId: number, keep = 50) {
  await run(
    `DELETE FROM searches WHERE user_id = ? AND id NOT IN
     (SELECT id FROM searches WHERE user_id = ? ORDER BY id DESC LIMIT ?)`,
    userId,
    userId,
    keep,
  );
}
