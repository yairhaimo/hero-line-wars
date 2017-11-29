import { Play } from './play';

export class Menu extends Phaser.State {
  static NAME = 'Menu';

  preload() {
    console.log('menu preload');
  }

  create() {}

  update() {}

  startGame() {
    this.game.state.start(Play.NAME);
  }
}
