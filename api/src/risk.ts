import { acceptPurchase, flagPurchaseForReview, rejectPurchase } from "./lib/action-api";
import { getAccountBalance, getNumMissedPayments, getRiskScore } from "./lib/risk-api";
import { getProductById } from "./model/Product";
import { RiskAssessment, setRiskAssessment } from "./model/RiskAssessment";
import { RiskAssessmentStatus } from "./types/RiskAssessmentStatus";

const assessRisk = async (productId: number, 
  userId: string, 
  paymentMethodId: string, ): Promise<RiskAssessment> => {

  const product = getProductById(productId);

  const missedPayments = await getNumMissedPayments(userId);
  console.log("🚀 ~ file: risk.ts ~ line 14 ~ missedPayments", missedPayments)
  if (missedPayments > 1) {
    rejectPurchase({ productId, userId, paymentMethodId });
    return setRiskAssessment(userId, paymentMethodId, RiskAssessmentStatus.REJECTED);
  }

  const accountBalance = await getAccountBalance(userId);
  console.log("🚀 ~ file: risk.ts ~ line 21 ~ accountBalance", accountBalance)
  if (accountBalance < product.productPrice) {
    rejectPurchase({ productId, userId, paymentMethodId });
    return setRiskAssessment(userId, paymentMethodId, RiskAssessmentStatus.REJECTED);
  }

  const riskScore = await getRiskScore(paymentMethodId);
  console.log("🚀 ~ file: risk.ts ~ line 28 ~ riskScore", riskScore)
  if (riskScore > 90) {
    await rejectPurchase({ productId, userId, paymentMethodId });
    return setRiskAssessment(userId, paymentMethodId, RiskAssessmentStatus.REJECTED);
  } else if (riskScore > 79) {
    await flagPurchaseForReview({ productId, userId, paymentMethodId });
    return setRiskAssessment(userId, paymentMethodId, RiskAssessmentStatus.FLAGGED_FOR_REVIEW);
  }

  await acceptPurchase({ productId, userId, paymentMethodId });
  return setRiskAssessment(userId, paymentMethodId, RiskAssessmentStatus.SUCCESS);
};

export { assessRisk };
