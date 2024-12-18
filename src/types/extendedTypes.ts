export interface ExtendedEvent {
  id: number
  name: string;
  date: string;
  location: string;
};

export interface ExtenedFight {
  id: number;
  eventId: number;
  winner: string;
  fighterOneId: number;
  fighterTwoId: number;
  winnerId: number;
  weightClass: string;
  methodName: string;
  methodDetails?: string | null;
  round: number;
  time: string;
};

export interface FightForEloCalculation {
  id: number;
  eventId: number;
  winner: string;
  fighterOneId: number;
  fighterTwoId: number;
  winnerId: number;
  weightClass: string;
  methodName: string;
  methodDetails?: string | null;
  round: number;
  time: string;
  date: string;
}

export interface ExtenedFighter {
  id: number;
  name: string;
  nickname?: string | null;
  height: number;
  weight: number;
  reach: number;
  stance: string;
  dob: string;
};

export interface ExtendedElo {
  id: number;
  fighterId: number;
  type: string;
  weightClass: string;
  date: string;
  value: number;
}