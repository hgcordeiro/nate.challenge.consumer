import { RiskAssessmentStatus } from "src/types/RiskAssessmentStatus";

export type RiskAssessment = {
  userId: string;
  paymentMethodId: string;
  status: RiskAssessmentStatus;
}

export let riskAssessments: RiskAssessment[] = [];

export const setRiskAssessment = (userId: string, paymentMethodId: string, status: RiskAssessmentStatus): RiskAssessment => {
  const riskAssessment = { userId, paymentMethodId, status };

  riskAssessments.push(riskAssessment);

  return riskAssessment;
};
