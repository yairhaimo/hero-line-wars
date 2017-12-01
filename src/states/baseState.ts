import { assets } from '../definitions';

export class BaseState extends Phaser.State {
  assets: { [key: string]: string } = assets;

  loadImage(name: string) {
    this.load.image(name, this.getAssetUrl(name));
  }

  private getAssetUrl(name: string): string {
    return `assets/${name}.png`;
  }

  loadSpritesheet(name: string, width: number = 32, height: number = 32) {
    this.load.spritesheet(name, this.getAssetUrl(name), width, height);
  }
}
