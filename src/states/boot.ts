import { Load } from './load';
import { BaseState } from './baseState';

export class Boot extends BaseState {
  static NAME = 'Boot';

  init() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  preload() {
    console.log('boot preload 2');
    // load assets for loader
  }

  create() {
    this.game.state.start(Load.NAME);
  }

  update() {}
}
