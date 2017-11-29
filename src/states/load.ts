import { Menu } from './menu';
// import { IMAGES } from '../definitions';

export class Load extends Phaser.State {
  static NAME = 'Load';

  preload() {
    console.log('load preload');
    // show loader (that we loaded in BOOT)
    // load assets for game

    // this.game.loadImage(IMAGES.CLOUD);
    // this.game.loadImage(IMAGES.GROUND);
    // this.game.loadImage(IMAGES.STAR);
    // this.game.loadImage(IMAGES.JIRA);
    // this.game.loadSpritesheet(IMAGES.PLAYER_T);
  }

  create() {
    this.game.state.start(Menu.NAME);
  }

  update() {}
}
