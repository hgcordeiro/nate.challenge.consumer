import cors from 'cors';
import express, { Request, Response } from 'express';
import { executePurchase } from './lib/purchase-api';
import { getProducts } from './model/Product';
import { savePurchase } from './model/Purchase';
import { assessRisk } from './risk';
import { PurchaseStatus } from './types/PurchaseStatus';
import { RiskAssessmentStatus } from './types/RiskAssessmentStatus';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/products', (_, res: Response) => {
  res.send(getProducts());
});

app.post('/purchase/:productId', async (req: Request, res: Response) => {
  const productId = Number(req.params.productId);
  const { userId, paymentMethodId } = req.body;

  const riskAssessment = await assessRisk(productId, userId, paymentMethodId);

  let status = PurchaseStatus.PENDING;

  switch(riskAssessment.status) {
    case RiskAssessmentStatus.SUCCESS:
      status = await executePurchase(userId, productId, paymentMethodId);
      break;
    
    case RiskAssessmentStatus.REJECTED:
      status = PurchaseStatus.REJECTED;
      break;
    
    case RiskAssessmentStatus.FLAGGED_FOR_REVIEW:
      status = PurchaseStatus.PENDING;
      break;
  }

  const purchase = savePurchase(productId, userId, paymentMethodId, status);

  res.send({ purchase, riskAssessment })
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
});

export default app;
