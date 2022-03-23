import { PurchaseStatus } from "src/types/PurchaseStatus";

export type Purchase = {
  id: string;
  productId: number; // It wasn't in the requirements, but I thought would make sense adding
  userId: string; // It wasn't in the requirements, but I thought would make sense adding
  paymentMethodId: string;
  status: PurchaseStatus;
};

export let purchases: Purchase[] = [];

export const savePurchase = (
  productId: number, 
  userId: string, 
  paymentMethodId: string, 
  status: PurchaseStatus,
): Purchase => {
  const id = purchases[purchases.length - 1]?.id + 1 || 1;

  const purchase = {
    id: String(id),
    productId,
    userId,
    paymentMethodId,
    status,
  };

  purchases.push(purchase);

  return purchase;
};
