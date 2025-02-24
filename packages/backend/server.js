const Koa = require("koa");
const { Pool } = require("pg");
const app = new Koa();

const pool = new Pool({
	user: "postgres",
	host: "db",
	database: "files_db",
	password: "postgres",
	port: 5432,
});

app.use(async (ctx) => {
	try {
		const client = await pool.connect();
		const result = await client.query("SELECT NOW()");
		ctx.body = `Database connection successful: ${result.rows[0].now}`;
		client.release();
	} catch (err) {
		ctx.body = "Database connection failed";
		ctx.status = 500;
	}
});

app.listen(5000, () => console.log("Backend running on port 5000"));
