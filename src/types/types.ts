export interface Event {
  name: string;
  date: string;
  location: string;
  fights: Fight[];
};

export interface Fight {
  winner: string;
  fighterOne: FighterFightData;
  fighterTwo: FighterFightData;
  weightClass: string;
  method: {
    name: string;
    details?: string;
  }
  round: number;
  time: string;
};

export interface Fighter {
  name: string;
  nickname?: string | null;
  height: number;
  weight: number;
  reach: number;
  stance: string;
  dob: string;
};

interface FighterFightData {
  name: string;
  link?: string;
  id?: number;
}