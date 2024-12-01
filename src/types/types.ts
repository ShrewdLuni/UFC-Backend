export interface Event {
  name: string;
  date: string;
  location: string;
  fights: Fight[];
};

export interface Fight {
  winner: string;
  fighters: {
    one: {
      name: string;
      link: string;
    };
    two:{
      name: string;
      link: string;
    };
  };
  KD: {
    one: string;
    two: string;
  };
  STR: {
    one: string;
    two: string;
  };
  TD: {
    one: string;
    two: string;
  };
  SUB: {
    one: string;
    two: string;
  };
  weightClass: string;
  method: {
    name: string;
    details: string;
  }
  round: string;
  time: string;
};

export interface Fighter {
  name: string;
  nickname: string;
  height: string;
  weight: string;
  reach: string;
  stance: string;
  dob: string;
};