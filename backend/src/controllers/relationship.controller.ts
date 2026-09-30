import type { Request, Response } from "express";
import mongoose from "mongoose";

import {
  Relationship,
  RelationshipType
} from "../models/relationship.model.js";

import { Infrastructure } from "../models/infrastructure.model.js";

export async function createRelationship(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      source,
      target,
      type,
      confidence = 1,
      metadata = {}
    } = req.body;

    if (!source || !target || !type) {
      res.status(400).json({
        success: false,
        message: "source, target and type are required"
      });

      return;
    }

    if (
      !mongoose.Types.ObjectId.isValid(source) ||
      !mongoose.Types.ObjectId.isValid(target)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid infrastructure ID"
      });

      return;
    }

    if (source === target) {
      res.status(400).json({
        success: false,
        message: "Source and target cannot be the same"
      });

      return;
    }

    const [sourceNode, targetNode] =
      await Promise.all([
        Infrastructure.findById(source),
        Infrastructure.findById(target)
      ]);

    if (!sourceNode || !targetNode) {
      res.status(404).json({
        success: false,
        message: "Source or target infrastructure not found"
      });

      return;
    }

    const relationship =
      await Relationship.findOneAndUpdate(
        {
          source,
          target,
          type
        },
        {
          $set: {
            confidence,
            lastSeen: new Date(),
            metadata
          },
          $setOnInsert: {
            firstSeen: new Date()
          }
        },
        {
          new: true,
          upsert: true
        }
      );

    res.status(201).json({
      success: true,
      data: relationship
    });
  } catch (error) {
    throw error;
  }
}

export async function getRelationships(
    req: Request<{ id: string }>,
    res: Response
): Promise<void> {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            success: false,
            message: "Invalid infrastructure ID"
        });

        return;
    }

    const relationships = await Relationship.find({
        $or: [
            { source: id },
            { target: id }
        ]
    })
        .populate("source")
        .populate("target")
        .sort({ lastSeen: -1 });

    res.json({
        success: true,
        count: relationships.length,
        data: relationships
    });
}

