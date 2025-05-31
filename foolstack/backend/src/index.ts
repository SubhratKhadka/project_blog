import express from "express";
import cors from "cors";

import { config } from "dotenv";
config()


// for db
import {initDatabase} from "../db/dbInit";
import {seedingDatabase} from "../db/seed";
import {viewAllDataFromDb} from "../db/dbDataView";

(async () => {
	// await initDatabase();
	// test
	// await seedingDatabase();
	// await viewAllDataFromDb();
})();

// routers
import blogRouter from "./routes/blogs.router";
import authRouter from "./routes/auth.router";
import userRouter from "./routes/user.router";

const app = express();
const PORT = 8080;

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
); // cross origin resource sharing
app.use(express.json()); // middleware req ko body linaa json ko format ma

// routes
app.get("/", (_req, res) => {
	res.send("Twake Production - Pratiyogita");
});

app.use("/auth", authRouter);

app.use("/blogs", blogRouter);

app.use('/user', userRouter)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// for cockroach db. prolly won't use
// cockroachdb pass = 8-P_3_4lZXnnM7XpYq_cdw
// for certification
// mkdir -p $env:appdata\postgresql\; Invoke-WebRequest -Uri https://cockroachlabs.cloud/clusters/08f31aee-15ed-4542-9ac3-ee2677b890df/cert -OutFile $env:appdata\postgresql\root.crt

// connectionString = "postgresql://surya:8-P_3_4lZXnnM7XpYq_cdw@fluid-ladybug-11461.j77.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"

// plain old postgres config data for my db
// postgres password su: 696969
// port: 8081
