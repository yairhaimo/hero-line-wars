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
    this.loadSpritesheet(this.assets.ALL, 16, 16, 1);
    this.loadTileMap(this.assets.MAP2);
    // this.loadImage(this.assets.PATH);
    // this.loadImage(this.assets.WALL);
    this.loadImage(this.assets.PARTICLE);
    this.loadImage(this.assets.BEACON);
  }

  create() {
    this.game.state.start(Menu.NAME);
  }

  update() {}
}
