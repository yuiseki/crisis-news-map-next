// @opennextjs/cloudflare's getCloudflareContext() types its `env` result as
// CloudflareEnv; `wrangler types` only generates the plain `Env` interface
// (from wrangler.jsonc bindings), so alias it here.
interface CloudflareEnv extends Env {}
