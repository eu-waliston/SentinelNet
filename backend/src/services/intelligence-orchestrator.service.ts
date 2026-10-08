import {
  dnsSource
} from "../collectors/dns.collector.js";

import {
  rdapSource
} from "../collectors/rdap.collector.js";

export async function collectDomainIntelligence(
  domain: string
) {
  const results = await Promise.allSettled([
    dnsSource.collect(domain),
    rdapSource.collect(domain)
  ]);

  return {
    target: domain,

    sources: results.map(
      (result, index) => ({
        source:
          index === 0
            ? dnsSource.name
            : rdapSource.name,

        status:
          result.status,

        data:
          result.status === "fulfilled"
            ? result.value
            : null,

        error:
          result.status === "rejected"
            ? String(result.reason)
            : null
      })
    ),

    collectedAt: new Date()
  };
}