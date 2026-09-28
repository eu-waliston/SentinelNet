import type {
    Request,
    Response
} from "express";

import {
    Infrastructure,
    InfrastructureType
} from "../models/infrastructure.model.js";

export async function createInfrastructure(req: Request, res: Response): Promise<void> {
    try {
        const { type, value, tags, metadata } = req.body;

        if (!type || !value) {
            res.status(400).json({
                success: false,
                message: "type and values are required"
            })

            return;
        }

        const infrastructure = await Infrastructure.findOneAndUpdate({
            type,
            value
        }, {
            $set: {
                lastSeen: new Date(),
                tags: tags ?? [],
                metadata: metadata ?? {}
            },

            $setOnInsert: {
                firstSeen: new Date(),
                riskScore: 0,
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
        })
    } catch (error) {
        throw error;
    }
}

export async function listInfrastructure(req: Request, res: Response): Promise<void> {
    const { type, limit = "50" } = req.body;

    const filter = type ? { type: type as InfrastructureType } : {}

    const infrastructure = await Infrastructure.find(filter).sort({ lastSeen: -1 }).limit(Number(limit))

    res.json({
        success: true,
        count: infrastructure.length,
        data: infrastructure
    })
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