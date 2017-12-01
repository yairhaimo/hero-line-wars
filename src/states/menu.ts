import { Play } from './play';
import { BaseState } from './baseState';

export class Menu extends BaseState {
  static NAME = 'Menu';

  preload() {
    console.log('menu preload');
  }

  create() {
    this.startGame();
  }

  update() {}

  startGame() {
    this.game.state.start(Play.NAME);
  }
}
