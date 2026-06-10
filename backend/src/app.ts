// backend/src/app.ts

import express from "express";
import authRoutes from './routes/authRoutes'
import projectRoutes from './routes/projectRoutes'
import allocationRoutes from './routes/allocationRoutes'
import employeeRoutes from "./routes/employeeRoutes"
import leaveRoutes from "./routes/leaveRoutes"
import leaveBalanceRoutes from "./routes/leaveBalanceRoutes"
import timesheetRoutes from "./routes/timesheetRoutes"
import resourceAvailabilityRoutes from "./routes/resourceAvailabilityRoutes"
import reportRoutes from "./routes/reportRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Resource Allocation API Running");
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/leave-balances", leaveBalanceRoutes);
app.use("/api/resource-availability", resourceAvailabilityRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;