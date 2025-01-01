import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";

// routes
import authRoutes from "./routes/authRoutes";
import verifyRoutes from "./routes/verifyRoutes";
import userRoutes from "./routes/userRoutes";

const app: Express = express();

// Enable CORS
app.use(
  cors({
    origin: "*", // Change this to the domain you will make requests from
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Jika menggunakan cookies/token
  })
);

app.use(bodyParser.json());
app.use("/api", authRoutes);
app.use("/api", verifyRoutes);
app.use("/api/collection", userRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
