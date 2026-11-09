'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { loginUrl, LoginReason } from '@/lib/loginUrl';

export type FlashboardModalReason = LoginReason;

interface FlashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: FlashboardModalReason;
  // Where to return after signing in. Omit to land on the dashboard.
  next?: string;
}

// There is no popup any more: "opening" this sends the visitor to the /login page.
// Kept as a component so every existing call site keeps working unchanged.
export default function FlashboardModal({ isOpen, onClose, reason = 'generic', next }: FlashboardModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    onClose(); // reset the caller's flag so the button works again if the user comes back
    if (!user) router.push(loginUrl(reason, next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return null;
}
