interface IMob {
  health: number;
  damage: number;
  range: number;
  speed: number;
}

interface IHero extends IMob {}

interface IMonster extends IMob {}

interface IStage {
  monsters: {
    interval: number;
    damage: number;
    health: number;
    range: number;
    speed: number;
    startPosition: {
      x: number;
      y: number;
    };
  };
  beacon: {
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
