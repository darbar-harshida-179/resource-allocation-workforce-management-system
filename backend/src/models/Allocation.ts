// backend/src/models/Allocation.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IAllocation extends Document {
    employee: mongoose.Types.ObjectId;
    project: mongoose.Types.ObjectId;
    allocationPercentage: number;
    startDate: Date;
    endDate: Date;
}

const allocationSchema = new Schema<IAllocation>(
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

        allocationPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// indexes
allocationSchema.index({ employee: 1 });
allocationSchema.index({ project: 1 });
allocationSchema.index({ startDate: 1 });
allocationSchema.index({ endDate: 1 });

const Allocation = mongoose.model<IAllocation>(
    "Allocation",
    allocationSchema
);

export default Allocation;