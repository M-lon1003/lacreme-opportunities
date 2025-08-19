import { computeFitScore } from '../src/lib/scoring'

describe('computeFitScore', () => {
  it('assigns higher score when disciplines and location match', () => {
    const opportunity = {
      disciplines: ['Painting', 'Drawing'],
      location: 'NSW, Australia',
      amount: 5000,
      closesOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      eligibility: ['Emerging artists'],
      tags: ['emerging'],
    }
    const prefs = {
      disciplines: ['Painting', 'Film'],
      locations: ['NSW'],
      minAmount: 1000,
      deadlineBufferDays: 7,
    }
    const score = computeFitScore(opportunity, prefs)
    expect(score).toBeGreaterThan(50)
  })
})