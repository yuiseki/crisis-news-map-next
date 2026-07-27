import { getCloudflareContext } from "@opennextjs/cloudflare";

// D1's binding is only available per-request (via Workers' `env` param), not
// at module load time, so callers must fetch it inside each request handler
// rather than caching a module-level singleton (see the retryer.js /
// getPrisma() cold-start timing issue hit in the other migrations in this
// batch for why).
export const getDb = async () => {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
};
