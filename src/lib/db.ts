import { Pool } from "pg";

// Plain Node runtime (k8s), not Workers, so a module-level singleton pool is
// fine here - no per-request binding dance needed.
let pool: Pool | undefined;

export const getDb = () => {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });
  }
  return pool;
};
