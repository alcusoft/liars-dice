import cors from "cors";
import express from "express";
import V1Router from "../routes/v1.route";
import errorMiddleware from "../middleware/error.middleware";

const port = process.env.HTTP_PORT ?? 4000;

const app = express();

// Initialize middleware
app.use(cors());
app.use(express.json());

// Initialize routes
app.use("/api/v1", V1Router);

// Initialize error handlers
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`HTTP server started on port ${port}`);
});

export default app;
