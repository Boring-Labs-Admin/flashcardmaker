export const PLANS = {
  free: { cardLimit: 30, charLimit: 20000,  fileLimit: 5,  maxBanked: 5  },
  plus: { cardLimit: 60, charLimit: 100000, fileLimit: 20, maxBanked: Infinity },
} as const;

export type PlanType = 'free' | 'plus';

export interface UserPlanData {
  plan: PlanType;
  free_banked: number;
  paid_credits: number;
  total_remaining: number | null; // null = unlimited (Plus)
  anonymous?: boolean;
  grant_applied?: boolean;   // true if a daily credit was added on this load
  grant_amount?: number;     // how many credits were granted
}
