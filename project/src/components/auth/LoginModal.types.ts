export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick?: () => void;
}

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;  
}
