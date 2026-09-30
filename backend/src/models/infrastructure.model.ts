import mongoose, { Document, Schema } from "mongoose";

export type InfrastructureType = | "DOMAIN" | "IP" | "ASN" | "CERTIFICATE";

export interface IInfrastruture extends Document {
    type: InfrastructureType;
    value: string;

    firstSeen: Date;
    lastSeen: Date;

    riskScore: number;

    tags: string[];

    metadata: Record<string, unknown>;

    createdAt: Date;
    updatedAt: Date;

    evidence: string;
}

const infraestructureSchema = new Schema<IInfrastruture>({
    type: {
        type: String,
        enum: [
            "DOMAIN",
            "IP",
            "ASN",
            "CERTIFICATE"
        ],
        required: true,
        index: true
    },

    value: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    firstSeen: {
        type: Date,
        default: Date.now
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    riskScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    tags: {
        type: [String],
        default: []
    },

    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
    evidence: {
        source: String,
        collectedAt: Date,
        value: Schema.Types.Mixed
    }
},
    {
        timestamps: true
    }

)

infraestructureSchema.index(
    { type: 1, value: 1 },
    { unique: true }
);

export const Infrastructure = mongoose.model<IInfrastruture>("Infrastructure", infraestructureSchema)