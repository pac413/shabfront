export interface RiskAssessment {
  ipAddress: string | null
  userAgent: string | null
  ipRiskScore: number | null
  minFraudRiskScore: number | null
  location: {
    city: string | null
    cityConfidence: number | null
    country: string | null
    countryConfidence: number | null
  }
}
