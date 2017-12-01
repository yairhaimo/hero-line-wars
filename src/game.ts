import { size } from './definitions';

export class Game extends Phaser.Game {
  constructor(
    config: Phaser.IGameConfig = { height: size.HEIGHT, width: size.WIDTH, renderer: Phaser.AUTO }
  ) {
    super(config);
  }
}
