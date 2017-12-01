import { Menu } from './menu';
import { BaseState } from './baseState';
// import { IMAGES } from '../definitions';

export class Load extends BaseState {
  static NAME = 'Load';

  preload() {
    console.log('load preload');
    // show loader (that we loaded in BOOT)
    // load assets for game
    this.loadSpritesheet(this.assets.HERO);
  }

  create() {
    this.game.state.start(Menu.NAME);
  }

  update() {}
}
