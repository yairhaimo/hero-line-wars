import { assets } from '../definitions';

export class BaseState extends Phaser.State {
  assets: { [key: string]: string } = assets;

  public loadImage(name: string) {
    this.load.image(name, this.getAssetUrl(name));
  }

  public loadSpritesheet(
    name: string,
    width: number = 32,
    height: number = 32,
    spacing: number = 0,
    margin: number = 0
  ) {
    this.load.spritesheet(name, this.getAssetUrl(name), width, height, -1, margin, spacing);
  }

  public loadTileMap(name) {
    this.load.tilemap(name, this.getAssetUrl(name, 'json'), null, Phaser.Tilemap.TILED_JSON);
  }

  private getAssetUrl(name: string, suffix: string = 'png'): string {
    return `assets/${name}.${suffix}`;
  }
}
