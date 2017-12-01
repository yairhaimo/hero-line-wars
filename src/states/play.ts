import { Hero } from '../prefabs/hero';
import { BaseState } from './baseState';

export class Play extends BaseState {
  static NAME = 'Play';

  preload() {
    console.log('play preload');
  }

  create() {
    const hero = new Hero({ game: this.game, xPos: 32, yPos: this.game.world.height - 250 });
  }

  update() {}
}
