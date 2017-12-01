import { assets } from '../definitions';

export class BaseSprite extends Phaser.Sprite {
  assets: { [key: string]: string } = assets;
}
