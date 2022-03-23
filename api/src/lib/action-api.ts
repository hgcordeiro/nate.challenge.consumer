const getDelayedVoid = async (): Promise<void> => {
  return new Promise((resolve) => {
    const timeout = 100 + (Math.random() * 400);

    setTimeout(() => resolve(), timeout);
  });
};

interface PurchaseDetails {
};

export const acceptPurchase = async (purchaseDetails: PurchaseDetails): Promise<void> => getDelayedVoid();

export const rejectPurchase = async (purchaseDetails: PurchaseDetails): Promise<void> => getDelayedVoid();

export const flagPurchaseForReview = async (purchaseDetails: PurchaseDetails): Promise<void> => getDelayedVoid();
