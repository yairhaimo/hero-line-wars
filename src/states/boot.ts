import { Load } from './load';
import { BaseState } from './baseState';
import { Game } from '../game';

export class Boot extends BaseState {
  static NAME = 'Boot';

  init() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    (this.game as Game).pathfinder = this.game.plugins.add((Phaser.Plugin as any).PathFinderPlugin);
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
