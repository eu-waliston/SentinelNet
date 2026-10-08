export interface DNSRecord {
    type: string;
    value: string;
    ttl?: string;
}

export interface DNSObservation {
    domain: string;
    records: DNSRecord[];
    collectedAt: Date;
    source: string;
}

export interface RDAPObservation {
    query: string;
    type: "DOMAIN" | "IP";
    handle?: string;
    name?: string;
    country?: string
    entities?: string[];
    nameservers?: string[];
    collectedAt: Date;
    source: string;
}

export interface IntelligenceSource<T> {
  name: string;

  collect(target: string): Promise<T>;
}