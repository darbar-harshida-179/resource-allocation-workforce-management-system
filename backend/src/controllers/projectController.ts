// backend/src/controllers/projectController.ts

import { Request, Response } from "express";
import Project, { ProjectStatus } from "../models/Project";
import Allocation from "../models/Allocation";

export const createProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.create(req.body);

        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create project",
        });
    }
};

export const getProjects = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const projects = await Project.find().populate(
            "manager",
            "firstName lastName email"
        );

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

export const getProjectById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id).populate(
            "manager",
            "firstName lastName email"
        );

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
};

export const updateProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};

export const closeProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        project.status = ProjectStatus.COMPLETED;

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project closed successfully",
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to close project",
        });
    }
};

export const getAssignedResources = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const allocations = await Allocation.find({
      project: req.params.id,
    }).populate(
      "employee",
      "firstName lastName email"
    );

    res.status(200).json({
      success: true,
      project: project.projectName,
      count: allocations.length,
      data: allocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned resources",
    });
  }
};

export const deleteProject = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const project = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};