import { BaseState } from './baseState';

export class Win extends BaseState {
  static NAME = 'Win';

  preload() {
    console.log('win preload');
  }

  create() {}

  update() {}
}
