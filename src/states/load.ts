import { Menu } from './menu';
import { BaseState } from './baseState';

export class Load extends BaseState {
  static NAME = 'Load';

  preload() {
    console.log('load preload');
    // show loader (that we loaded in BOOT)
    // load assets for game
    this.loadSpritesheet(this.assets.HERO);
    this.loadSpritesheet(this.assets.MONSTER);
    this.loadTileMap(this.assets.MAP);
    this.loadImage(this.assets.ROAD);
    this.loadImage(this.assets.WALL);
    this.loadImage(this.assets.PARTICLE);
  }

  create() {
    this.game.state.start(Menu.NAME);
  }

  update() {}
}
