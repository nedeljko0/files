import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import folderRoutes from "./routes/folders";
import documentRoutes from "./routes/documents";
import { errorHandler } from "./middleware/errorHandler";

const app = new Koa();

app.use(errorHandler);

// Middleware
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err: any) {
		ctx.status = err.status || 500;
		ctx.body = { error: err.message || "Internal Server Error" };
		ctx.app.emit("error", err, ctx);
	}
});

app.use(cors({}) as Koa.Middleware);
app.use(bodyParser({}));

// Security headers
app.use(async (ctx, next) => {
	ctx.set("X-Content-Type-Options", "nosniff");
	ctx.set("X-Frame-Options", "DENY");
	ctx.set("X-XSS-Protection", "1; mode=block");
	await next();
});

// Routes
app.use(folderRoutes.routes());
app.use(documentRoutes.routes());

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
