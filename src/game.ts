import * as Phaser from 'phaser-ce';

export class Game extends Phaser.Game {
  constructor(height = 640, width = 320) {
    super(height, width, Phaser.AUTO, '');
    this.physics.startSystem(Phaser.Physics.ARCADE);
  }
}
