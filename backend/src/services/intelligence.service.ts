import {
  Infrastructure
} from "../models/infrastructure.model.js";

import {
  Relationship
} from "../models/relationship.model.js";

import {
  collectDNS
} from "../collectors/dns.collector.js";

import {
  collectRDAP
} from "../collectors/rdap.collector.js";

import {
  normalizeDomain
} from "../utils/normalize.js";

export async function analyzeDomain(
  input: string
) {
  const domain = normalizeDomain(input);

  const [dnsResult, rdapResult] =
    await Promise.all([
      collectDNS(domain),
      collectRDAP(domain)
    ]);

  /*
   * 1. DOMAIN
   */

  const domainNode =
    await Infrastructure.findOneAndUpdate(
      {
        type: "DOMAIN",
        value: domain
      },
      {
        $set: {
          lastSeen: new Date(),

          metadata: {
            rdap: rdapResult
          }
        },

        $setOnInsert: {
          firstSeen: new Date(),
          riskScore: 0
        }
      },
      {
        upsert: true,
        new: true
      }
    );

  /*
   * 2. DNS → IP
   */

  for (const record of dnsResult.records) {
    if (
      record.type !== "A" &&
      record.type !== "AAAA"
    ) {
      continue;
    }

    const ipNode =
      await Infrastructure.findOneAndUpdate(
        {
          type: "IP",
          value: record.value
        },
        {
          $set: {
            lastSeen: new Date()
          },

          $setOnInsert: {
            firstSeen: new Date(),
            riskScore: 0
          }
        },
        {
          upsert: true,
          new: true
        }
      );

    await Relationship.findOneAndUpdate(
      {
        source: domainNode!._id,
        target: ipNode!._id,
        type: "RESOLVES_TO"
      },
      {
        $set: {
          lastSeen: new Date(),
          confidence: 1,

          metadata: {
            source: "dns",
            recordType: record.type
          }
        },

        $setOnInsert: {
          firstSeen: new Date()
        }
      },
      {
        upsert: true,
        new: true
      }
    );
  }

  return {
    domain: domainNode,
    dns: dnsResult,
    rdap: rdapResult
  };
}