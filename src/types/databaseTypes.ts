export interface DatabaseEvent {
  name: string;
  date: string;
  location: string;
};

export interface DatabaseFight {
  winner: string;
  fighterOneId: number;
  fighterTwoId: number;
  weightClass: string;
  methodName: string;
  methodDetails?: string;
  round: number;
  time: string;
};

export interface DatabaseFighter {
  name: string;
  nickname: string | null;
  height: number;
  weight: number;
  reach: number;
  stance: string;
  dob: string;
};
