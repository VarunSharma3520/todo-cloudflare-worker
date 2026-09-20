const PROD_URL = "https://test-cloudflare.sv279508.workers.dev";
const LOCAL_URL = "http://127.0.0.1:8788";

const isProd = process.argv.includes("--prod");
const baseUrl = process.env.SEED_URL ?? (isProd ? PROD_URL : LOCAL_URL);

const seedTodos = [
  { title: "Buy groceries", description: "Milk, eggs, bread", completed: false },
  { title: "Learn Cloudflare D1", description: "Drizzle + Hono CRUD", completed: false },
  { title: "Deploy worker", description: "wrangler deploy --minify", completed: true },
];

async function main() {
  console.log(`Seeding ${baseUrl}/todo ...`);
  for (const todo of seedTodos) {
    const res = await fetch(`${baseUrl}/todo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    const body = await res.json().catch(() => ({}));
    console.log(res.status, JSON.stringify(body));
    if (!res.ok) process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
