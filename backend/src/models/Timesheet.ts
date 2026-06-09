// backend/src/models/Timesheet.ts

import mongoose, { Document, Schema, } from "mongoose";

export interface ITimesheet
    extends Document {
    employee: mongoose.Types.ObjectId;
    project: mongoose.Types.ObjectId;
    date: Date;
    hours: number;
    status:
    | "pending"
    | "approved"
    | "rejected";
}

const timesheetSchema =
    new Schema<ITimesheet>(
        {
            employee: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            project: {
                type: Schema.Types.ObjectId,
                ref: "Project",
                required: true,
            },

            date: {
                type: Date,
                required: true,
            },

            hours: {
                type: Number,
                required: true,
                min: 0,
                max: 24,
            },

            status: {
                type: String,
                enum: [
                    "pending",
                    "approved",
                    "rejected",
                ],
                default: "pending",
            },
        },
        {
            timestamps: true,
        }
    );

const Timesheet = mongoose.model<ITimesheet>("Timesheet", timesheetSchema);

export default Timesheet;