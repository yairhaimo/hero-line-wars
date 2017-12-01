import { BaseState } from './baseState';

export class Lose extends BaseState {
  static NAME = 'Lose';

  preload() {
    console.log('lose preload');
  }

  create() {
    console.log('you have lost');
  }

  update() {}
}
