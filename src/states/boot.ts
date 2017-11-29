import * as Phaser from 'phaser-ce';
import { Load } from './load';

export class Boot extends Phaser.State {
  static NAME = 'Boot';

  init(settings) {}

  preload() {
    console.log('boot preload');
  }

  create() {
    this.game.state.start(Load.NAME);
  }

  update() {}
}
