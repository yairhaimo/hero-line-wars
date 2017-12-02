interface IMob {
  health: number;
  mana: number;
  damage: number;
  range: number;
  speed: number;
}

interface IHero extends IMob {}

interface IMonster extends IMob {
  xp: number;
  coins: number;
}

interface IHUD {
  health: number;
  coins: number;
  xp: number;
  level: number;
  kills: number;
}

interface IStage {
  monsters: {
    interval: number;
    damage: number;
    health: number;
    mana: number;
    range: number;
    speed: number;
    xp: number;
    coins: number;
    startPosition: {
      x: number;
      y: number;
    };
  };
  beacon: {
    health: number;
    position: {
      x: number;
      y: number;
    };
  };
}

interface IBeacon {
  health: number;
}

declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};
