import type {
  Request,
  Response
} from "express";

import mongoose from "mongoose";

import {
  Infrastructure,
  InfrastructureType
} from "../models/infrastructure.model.js";
import { Relationship } from "../models/relationship.model.js";

import {
  analyzeDomain
} from "../services/intelligence.service.js";

import {
  collectDomainIntelligence
} from "../services/intelligence-orchestrator.service.js";

export async function createInfrastructure(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      type,
      value,
      tags,
      metadata
    } = req.body;

    if (!type || !value) {
      res.status(400).json({
        success: false,
        message: "type and value are required"
      });

      return;
    }

    const infrastructure =
      await Infrastructure.findOneAndUpdate(
        {
          type,
          value
        },
        {
          $set: {
            lastSeen: new Date(),
            tags: tags ?? [],
            metadata: metadata ?? {}
          },
          $setOnInsert: {
            firstSeen: new Date(),
            riskScore: 0
          }
        },
        {
          new: true,
          upsert: true
        }
      );

    res.status(201).json({
      success: true,
      data: infrastructure
    });
  } catch (error) {
    throw error;
  }
}

export async function listInfrastructure(
  req: Request,
  res: Response
): Promise<void> {
  const { type, limit = "50" } = req.query;

  const filter =
    type
      ? { type: type as InfrastructureType }
      : {};

  const infrastructure =
    await Infrastructure
      .find(filter)
      .sort({ lastSeen: -1 })
      .limit(Number(limit));

  res.json({
    success: true,
    count: infrastructure.length,
    data: infrastructure
  });
}
export async function getInfrastructure(
  req: Request,
  res: Response
): Promise<void> {
  const infrastructure =
    await Infrastructure.findById(req.params.id);

  if (!infrastructure) {
    res.status(404).json({
      success: false,
      message: "Infrastructure not found"
    });

    return;
  }

  res.json({
    success: true,
    data: infrastructure
  });
}

export async function getInfrastructureGraph(
  req: Request<{id: string}>,
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

  const node =
    await Infrastructure.findById(id);

  if (!node) {
    res.status(404).json({
      success: false,
      message: "Infrastructure not found"
    });

    return;
  }

  const relationships =
    await Relationship.find({
      $or: [
        { source: id },
        { target: id }
      ]
    })
      .populate("source")
      .populate("target");

  const nodes = new Map<
    string,
    unknown
  >();

  nodes.set(
    node._id.toString(),
    node
  );

  for (const relationship of relationships) {
    const source = relationship.source as any;
    const target = relationship.target as any;

    nodes.set(
      source._id.toString(),
      source
    );

    nodes.set(
      target._id.toString(),
      target
    );
  }

  res.json({
    success: true,

    data: {
      root: node,

      nodes: Array.from(
        nodes.values()
      ),

      relationships
    }
  });
}

export async function analyze(
  req: Request,
  res: Response
): Promise<void> {
  const { domain } = req.body;

  if (!domain) {
    res.status(400).json({
      success: false,
      message: "domain is required"
    });

    return;
  }

  const result =
    await analyzeDomain(domain);

  res.status(200).json({
    success: true,
    data: result
  });
}

export async function collectIntelligence(
  req: Request,
  res: Response
): Promise<void> {

  const { domain } = req.body;

  if (!domain) {
    res.status(400).json({
      success: false,
      message: "domain is required"
    });

    return;
  }

  const result =
    await collectDomainIntelligence(domain);

  res.status(200).json({
    success: true,
    data: result
  });
}