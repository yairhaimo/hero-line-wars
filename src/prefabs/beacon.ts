import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';

export class Beacon extends BaseSprite implements IBeacon {
  private SCALE: number = 0.5;
  private colliders: any[];
  private attributes: IBeacon;

  constructor({
    game,
    xPos,
    yPos,
    colliders = [],
    attributes
  }: {
    game: Game;
    xPos: number;
    yPos: number;
    colliders?: any[];
    attributes: IBeacon;
  }) {
    super(game, xPos, yPos, assets.BEACON);
    this.init();
    this.addToGame();
    this.colliders = colliders;
    this.attributes = attributes;
    this.health = attributes.health;
  }

  private addToGame() {
    this.game.add.existing(this);
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    this.game.physics.arcade.enable(this);
  }

  public update() {}
}
