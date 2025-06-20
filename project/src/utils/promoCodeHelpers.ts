import { ValidPromoCode } from '../types/payment';

const promoCodeDiscounts: Record<ValidPromoCode, number> = {
  'WELCOME20': 20,  // 20% off
  'SPECIAL50': 50,  // 50% off
  'NEWUSER10': 10,  // 10% off
  'FLASH25': 25,    // 25% off
  'STUDENT15': 15   // 15% off for students
};

export const validatePromoCode = (code: string): number => {
  const upperCode = code.toUpperCase() as ValidPromoCode;
  return promoCodeDiscounts[upperCode] || 0;
};

export const calculateDiscountedAmount = (originalAmount: number, discountPercent: number): number => {
  if (discountPercent > 0) {
    return Math.floor(originalAmount * (1 - discountPercent / 100));
  }
  return originalAmount;
};
