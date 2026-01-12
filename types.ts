
export type Pair = 'NQ' | 'ES' | 'EU';
export type Session = 'Asia' | 'London' | 'Pre-NY' | 'NY';
export type CRT = 'Daily' | '4H' | '1H' | 'M30' | 'M15';
export type EntryType = 'Risk Entry' | 'Confirmation Entry';
export type RiskLevel = '0.25%' | '0.5%' | '1%';
export type Rating = 'A' | 'B' | 'C';
export type Result = 'Win' | 'Loss' | 'Small Win' | 'Small Loss';

export interface POICategories {
  fvg: string[];
  ob: string[];
  other: string[];
}

export interface PsychologyReview {
  rulesFollowed: boolean;
  brokenRuleDescription?: string;
  recap: {
    drawOnLiquidity: string;
    htfNarrative: string;
  };
  mistakes: string[];
  whatWentWell: string[];
  whatWentWrong: string[];
  keyLesson: string;
}

export interface Trade {
  id: string;
  pair: Pair;
  date: string;
  entryTime: string;
  exitTime: string;
  session: Session;
  crt: CRT;
  poi: POICategories;
  smtTypes: string[];
  entryType: EntryType;
  risk: RiskLevel;
  rr: string;
  rating: Rating;
  result: Result;
  images: string[];
  review: PsychologyReview;
  createdAt: number;
}

export interface DashboardStats {
  winRate: number;
  avgRR: number;
  totalTrades: number;
  wins: number;
  losses: number;
  sessionDistribution: Record<Session, number>;
  entryTypeDistribution: Record<EntryType, number>;
  ratingDistribution: Record<Rating, number>;
  riskDistribution: Record<RiskLevel, number>;
}
