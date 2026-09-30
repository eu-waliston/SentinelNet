import mongoose, {
    Document,
    Schema,
    Types
} from "mongoose";

export type RelationshipType =
    | "RESOLVES_TO"
    | "USES_CERTIFICATE"
    | "BELONGS_TO_ASN"
    | "SHARES_INFRASTRUCTURE"
    | "REDIRECTS_TO";

export interface IRelationship extends Document {
    source: Types.ObjectId;
    target: Types.ObjectId;

    type: RelationshipType;

    confidence: number;

    firstSeen: Date;
    lastSeen: Date;

    metadata: Record<string, unknown>

    createdAt: Date;
    updatedAt: Date;
}

const relationshipSchema = new Schema<IRelationship>({
    source: {
        type: Schema.Types.ObjectId,
        ref: "Infrastructure",
        required: true,
        index: true
    },

    target: {
        type: Schema.Types.ObjectId,
        ref: "Infrastructure",
        required: true,
        index: true
    },

    type: {
        type: String,
        enum: [
            "RESOLVES_TO",
            "USES_CERTIFICATE",
            "BELONGS_TO_ASN",
            "SHARES_INFRASTRUCTURE",
            "REDIRECTS_TO",
        ],

        required: true,
        index: true
    },

    confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 1
    },

    firstSeen: {
        type: Date,
        default: Date.now
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
})

relationshipSchema.index({
    source: 1,
    target: 1,
    type: 1
}, {
    unique: true
})

export const Relationship = mongoose.model<IRelationship>("Relationship", relationshipSchema);