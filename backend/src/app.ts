// backend/src/app.ts

import express from "express";
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import allocationRoutes from './routes/allocationRoutes'

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Resource Allocation API Running");
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/allocations", allocationRoutes);

export default app;