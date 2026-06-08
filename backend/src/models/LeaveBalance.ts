// backend/src/models/LeaveBalance.ts

import mongoose, {
    Document,
    Schema,
} from "mongoose";

export interface ILeaveBalance
    extends Document {
    employee: mongoose.Types.ObjectId;
    casual: number;
    sick: number;
    earned: number;
}

const leaveBalanceSchema =
    new Schema<ILeaveBalance>(
        {
            employee: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                unique: true,
            },

            casual: {
                type: Number,
                default: 12,
            },

            sick: {
                type: Number,
                default: 10,
            },

            earned: {
                type: Number,
                default: 18,
            },
        },
        {
            timestamps: true,
        }
    );

const LeaveBalance =
    mongoose.model<ILeaveBalance>(
        "LeaveBalance",
        leaveBalanceSchema
    );

export default LeaveBalance;