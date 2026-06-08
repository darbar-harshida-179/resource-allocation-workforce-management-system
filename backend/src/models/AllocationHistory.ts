// backend/src/models/AllocationHistory.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IAllocationHistory extends Document {
  employee: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  allocationPercentage: number;
  action: string;
}

const allocationHistorySchema =
  new Schema<IAllocationHistory>(
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
      },

      action: {
        type: String,
        enum: ["created", "updated", "deleted"],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const AllocationHistory =
  mongoose.model<IAllocationHistory>(
    "AllocationHistory",
    allocationHistorySchema
  );

export default AllocationHistory;