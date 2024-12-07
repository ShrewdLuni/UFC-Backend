export interface DatabaseEvent {
  name: string;
  date: string;
  location: string;
};

export interface DatabaseFight {
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

export interface DatabaseFighter {
  name: string;
  nickname?: string | null;
  height: number;
  weight: number;
  reach: number;
  stance: string;
  dob: string;
};

export interface DatabaseElo {
  fighterId: number;
  type: string;
  weightClass: string;
  date: string;
  value: number;
}