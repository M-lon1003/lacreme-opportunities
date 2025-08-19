/**
 * Scoring utilities for ranking opportunities according to a user's preferences.
 *
 * The weights reflect the relative importance described in the project brief.
 */

export interface Opportunity {
  disciplines: string[]
  location: string
  amount?: number | null
  closesOn?: Date | null
  eligibility: string[]
  tags: string[]
}

export interface ProfilePrefs {
  disciplines: string[]
  locations: string[]
  minAmount?: number | null
  deadlineBufferDays?: number
}

const WEIGHTS = {
  disciplineMatch: 0.4,
  locationMatch: 0.25,
  amountPreference: 0.15,
  deadlineProximity: 0.15,
  eligibilityKeywords: 0.05,
} as const

const KEYWORDS = ['emerging', 'mid-career', 'public art', 'mural', 'game', 'film', 'digital', 'AR/VR', 'residency']

/**
 * Compute a fit score between 0 and 100.  Higher is better.
 */
export function computeFitScore(op: Opportunity, prefs: ProfilePrefs): number {
  let score = 0
  let weightSum = 0

  // Discipline match: proportion of disciplines that overlap
  weightSum += WEIGHTS.disciplineMatch
  if (prefs.disciplines && prefs.disciplines.length > 0) {
    const matches = op.disciplines.filter((d) => prefs.disciplines.map((p) => p.toLowerCase()).includes(d.toLowerCase())).length
    const ratio = matches / prefs.disciplines.length
    score += ratio * 100 * WEIGHTS.disciplineMatch
  }

  // Location match: 1 if the location string contains any of the preferred locations
  weightSum += WEIGHTS.locationMatch
  if (prefs.locations && prefs.locations.length > 0) {
    const locMatch = prefs.locations.some((loc) => op.location.toLowerCase().includes(loc.toLowerCase()))
    score += (locMatch ? 100 : 0) * WEIGHTS.locationMatch
  }

  // Amount preference: 1 if amount >= minAmount (or no minAmount specified)
  weightSum += WEIGHTS.amountPreference
  if (prefs.minAmount && op.amount != null) {
    const meets = op.amount >= prefs.minAmount
    score += (meets ? 100 : 0) * WEIGHTS.amountPreference
  } else {
    // if no min amount specified, treat as neutral
    score += 50 * WEIGHTS.amountPreference
  }

  // Deadline proximity: linear decay from 100 today to 0 at 120 days from now
  weightSum += WEIGHTS.deadlineProximity
  if (op.closesOn) {
    const today = new Date()
    const diffMs = op.closesOn.getTime() - today.getTime()
    const days = diffMs / (1000 * 60 * 60 * 24)
    const buffer = prefs.deadlineBufferDays ?? 0
    if (days <= buffer) {
      // already expired or too close; give low score
      score += 0
    } else if (days > 120) {
      score += 0
    } else {
      const proximity = (120 - (days - buffer)) / 120
      score += proximity * 100 * WEIGHTS.deadlineProximity
    }
  } else {
    // unknown deadline
    score += 50 * WEIGHTS.deadlineProximity
  }

  // Eligibility keywords: count occurrences of keywords in eligibility or tags or disciplines
  weightSum += WEIGHTS.eligibilityKeywords
  const text = [...op.eligibility, ...op.tags, ...(op.disciplines || [])].join(' ').toLowerCase()
  const keywordMatches = KEYWORDS.filter((kw) => text.includes(kw.toLowerCase())).length
  const keywordRatio = KEYWORDS.length > 0 ? keywordMatches / KEYWORDS.length : 0
  score += keywordRatio * 100 * WEIGHTS.eligibilityKeywords

  // Normalise to 0–100
  if (weightSum > 0) {
    return Math.round(score / weightSum)
  }
  return 0
}