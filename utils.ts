import { IdentityProfile } from './types';

/**
 * Generates a simplified, sorted canonical object from the profile data
 * to ensuring hashing is deterministic regardless of key order in the source.
 */
const toCanonicalJson = (data: IdentityProfile) => {
  return {
    name: data.fullName,
    role: data.summary.primaryRole,
    org: data.summary.primaryOrg,
    links: data.links.reduce((acc, link) => ({ ...acc, [link.label]: link.url }), {}),
    updated: data.lastUpdated,
    version: data.version,
    positions: data.currentPositions.map(p => `${p.role} @ ${p.company}`),
    location: data.location
  };
};

/**
 * Computes a SHA-256 hash of the canonical JSON data.
 * Returns the first 10 characters in uppercase.
 */
export async function generateIdentityChecksum(data: IdentityProfile): Promise<string> {
  const canonical = toCanonicalJson(data);
  const jsonString = JSON.stringify(canonical);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.substring(0, 10).toUpperCase();
}