export class Player extends Phaser.Sprite {
  constructor({ game, colliders }) {
    super(game, 32, game.world.height - 250);
    game.add.existing(this);
  }

  update() {}
}
