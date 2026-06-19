// backend/src/models/Leave.ts

import mongoose, { Document, Schema } from "mongoose";

export interface ILeave extends Document {
    employee: mongoose.Types.ObjectId;
    leaveType: "casual" | "sick" | "earned";
    startDate: Date;
    endDate: Date;
    reason: string;
    status: "pending" | "approved" | "rejected";
}

const leaveSchema = new Schema<ILeave>(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        leaveType: {
            type: String,
            enum: ["casual", "sick", "earned"],
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);
leaveSchema.index({ employee: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1 });
leaveSchema.index({ endDate: 1 });

const Leave = mongoose.model<ILeave>(
    "Leave",
    leaveSchema
);

export default Leave;