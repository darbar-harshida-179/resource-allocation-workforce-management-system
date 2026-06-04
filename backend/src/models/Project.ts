// backend/src/models/Project.ts

import mongoose, { Document, Schema } from "mongoose";

export enum ProjectStatus {
  PLANNING = "planning",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  ON_HOLD = "on-hold",
}

export interface IProject extends Document {
  projectName: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  manager: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
    },

    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>(
  "Project",
  projectSchema
);

export default Project;