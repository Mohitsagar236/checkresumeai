export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: 'monthly' | 'yearly';
  isProcessing: boolean;
  onConfirm: () => Promise<void>;
}
