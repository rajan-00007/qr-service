import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import qrRoutes from "./routes/qrRoutes";
import { resolveQRController } from "./controllers/resolver.controller";

dotenv.config({ quiet: true } as any);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/qr", qrRoutes);


app.get("/q/:shortCode", resolveQRController);

// check
app.get("/", (_req, res) => {
    res.send("API is Running...")
});

export default app;
