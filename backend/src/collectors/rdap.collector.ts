import {
  RDAPObservation
} from "../types/intelligence.types.js";

import type {
  IntelligenceSource
} from "../types/intelligence-source.types.js";

export async function collectRDAP(
  domain: string
): Promise<RDAPObservation> {
  const response = await fetch(
    `https://rdap.org/domain/${encodeURIComponent(domain)}`
  );

  if (!response.ok) {
    throw new Error(
      `RDAP request failed: ${response.status}`
    );
  }

  const data = await response.json();

  const nameservers =
    Array.isArray(data.nameservers)
      ? data.nameservers
          .map(
            (item: { ldhName?: string }) =>
              item.ldhName
          )
          .filter(Boolean)
      : [];

  return {
    query: domain,
    type: "DOMAIN",

    handle: data.handle,

    name: data.ldhName,

    nameservers,

    collectedAt: new Date(),

    source: "rdap.org"
  };
}



export const rdapSource:
  IntelligenceSource<RDAPObservation> = {

  name: "rdap.org",

  async collect(
    domain: string
  ): Promise<RDAPObservation> {

    const response = await fetch(
      `https://rdap.org/domain/${encodeURIComponent(domain)}`
    );

    if (!response.ok) {
      throw new Error(
        `RDAP request failed: ${response.status}`
      );
    }

    const data = await response.json();

    const nameservers =
      Array.isArray(data.nameservers)
        ? data.nameservers
            .map(
              (item: { ldhName?: string }) =>
                item.ldhName
            )
            .filter(Boolean)
        : [];

    return {
      query: domain,
      type: "DOMAIN",

      handle: data.handle,
      name: data.ldhName,

      nameservers,

      collectedAt: new Date(),
      source: "rdap.org"
    };
  }
};