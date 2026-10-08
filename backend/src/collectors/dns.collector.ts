import { promises as dns } from "node:dns";

import {
  DNSObservation,
  DNSRecord
} from "../types/intelligence.types.js";

import { normalizeDomain } from "../utils/normalize.js";


import type {
  IntelligenceSource
} from "../types/intelligence-source.types.js";



export async function collectDNS(
  input: string
): Promise<DNSObservation> {
  const domain = normalizeDomain(input);

  const records: DNSRecord[] = [];

  const ipv4 = await dns
    .resolve4(domain)
    .catch(() => []);

  for (const address of ipv4) {
    records.push({
      type: "A",
      value: address
    });
  }

  const ipv6 = await dns
    .resolve6(domain)
    .catch(() => []);

  for (const address of ipv6) {
    records.push({
      type: "AAAA",
      value: address
    });
  }

  const cname = await dns
    .resolveCname(domain)
    .catch(() => []);

  for (const value of cname) {
    records.push({
      type: "CNAME",
      value
    });
  }

  const nameservers = await dns
    .resolveNs(domain)
    .catch(() => []);

  for (const value of nameservers) {
    records.push({
      type: "NS",
      value
    });
  }

  return {
    domain,
    records,
    collectedAt: new Date(),
    source: "system-dns"
  };
}



export const dnsSource: IntelligenceSource<DNSObservation> = {
  name: "system-dns",

  async collect(
    target: string
  ): Promise<DNSObservation> {
    const domain = normalizeDomain(target);

    const records: DNSRecord[] = [];

    const ipv4 = await dns
      .resolve4(domain)
      .catch(() => []);

    for (const address of ipv4) {
      records.push({
        type: "A",
        value: address
      });
    }

    const ipv6 = await dns
      .resolve6(domain)
      .catch(() => []);

    for (const address of ipv6) {
      records.push({
        type: "AAAA",
        value: address
      });
    }

    const cname = await dns
      .resolveCname(domain)
      .catch(() => []);

    for (const value of cname) {
      records.push({
        type: "CNAME",
        value
      });
    }

    const nameservers = await dns
      .resolveNs(domain)
      .catch(() => []);

    for (const value of nameservers) {
      records.push({
        type: "NS",
        value
      });
    }

    return {
      domain,
      records,
      collectedAt: new Date(),
      source: "system-dns"
    };
  }
};