export class Game extends Phaser.Game {
  constructor(config: Phaser.IGameConfig = { height: 320, width: 640, renderer: Phaser.AUTO }) {
    super(config);
    setTimeout(() => {
      this.physics.startSystem(Phaser.Physics.ARCADE);
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    });
  }
}
