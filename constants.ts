
import { Pair, Session, CRT, EntryType, RiskLevel, Rating, Result } from './types';

export const PAIRS: Pair[] = ['NQ', 'ES', 'EU'];
export const SESSIONS: Session[] = ['Asia', 'London', 'Pre-NY', 'NY'];
export const CRTS: CRT[] = ['Daily', '4H', '1H', 'M30', 'M15'];
export const ENTRY_TYPES: EntryType[] = ['Risk Entry', 'Confirmation Entry'];
export const RISK_LEVELS: RiskLevel[] = ['0.25%', '0.5%', '1%'];
export const RATINGS: Rating[] = ['A', 'B', 'C'];
export const RESULTS: Result[] = ['Win', 'Loss', 'Small Win', 'Small Loss'];

export const POI_FVG = ['Daily FVG', '4H FVG', '1H FVG', 'M30 FVG', 'M15 FVG'];
export const POI_OB = ['Daily OB', '4H OB', '1H OB', 'M30 OB', 'M15 OB'];
export const POI_OTHER = [
  'Rejection Block (RB)',
  'Midnight Open',
  'Weekly Open',
  'Standard Deviation',
  'PSL',
  'PSH',
  'PDH',
  'PDL',
];

export const SMT_TYPES = ['HTF SMT', 'LTF SMT', 'HTF OB SMT', 'Midnight SMT'];
