import { Load } from './load';

export class Boot extends Phaser.State {
  static NAME = 'Boot';

  preload() {
    console.log('boot preload');
  }

  create() {
    this.game.state.start(Load.NAME);
  }

  update() {}
}
