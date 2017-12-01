import { size } from './definitions';

export class Game extends Phaser.Game {
  public pathfinder;
  constructor(config: Phaser.IGameConfig = { height: size.HEIGHT, width: size.WIDTH, renderer: Phaser.AUTO }) {
    super(config);
  }
}
