import { computeChecksumFor, mergeOpportunity } from '../src/lib/dedupe'
import { Opportunity } from '@prisma/client'

describe('dedupe utilities', () => {
  it('computes deterministic checksum', () => {
    const a = computeChecksumFor('Test Opportunity', 'https://example.com/path', 'Org')
    const b = computeChecksumFor('test opportunity', 'https://example.com/other', 'org')
    expect(a).toEqual(b)
  })
  it('merges opportunities preserving createdAt', () => {
    const existing: Opportunity = {
      id: '1',
      name: 'Old',
      category: 'Grant',
      disciplines: [],
      location: '',
      org: '',
      amount: null,
      currency: null,
      opensOn: null,
      closesOn: null,
      url: '',
      eligibility: [],
      fee: null,
      source: 'seed',
      tags: [],
      fitScore: 0,
      checksum: 'abc',
      lastCheckedAt: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    }
    const incoming: Opportunity = {
      ...existing,
      id: '2',
      name: 'New',
      createdAt: new Date('2025-01-01'),
    }
    const merged = mergeOpportunity(existing, incoming)
    expect(merged.id).toBe(existing.id)
    expect(merged.createdAt).toEqual(existing.createdAt)
    expect(merged.name).toBe('New')
  })
})