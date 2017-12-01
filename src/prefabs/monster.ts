import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';
import { Hero } from './hero';

export class Monster extends BaseSprite {
  private VELOCITY: number = 30;
  private ANIMATIONS = {
    WALK: 'walk'
  };
  private SCALE: number = 0.5;
  private cursors: Phaser.CursorKeys;
  private colliders: any[];
  private hero: Hero;
  private attributes: IMonster;

  constructor({
    game,
    xPos,
    yPos,
    colliders = [],
    hero,
    attributes
  }: {
    game: Game;
    xPos: number;
    yPos: number;
    colliders?: any[];
    hero: Hero;
    attributes: IMonster;
  }) {
    super(game, xPos, yPos, assets.MONSTER);
    this.init();
    this.colliders = colliders;
    this.hero = hero;
    this.attributes = attributes;
    this.health = attributes.health;
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    // this.game.physics.arcade.enable(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.defineAnimation();
    this.animations.play(this.ANIMATIONS.WALK);
  }

  private defineAnimation() {
    this.animations.add(this.ANIMATIONS.WALK, [0, 1, 2, 3], 16, true);
  }

  public update() {
    this.colliders.forEach(collider => this.game.physics.arcade.collide(this, collider));

    if (this.hero.alive) {
      if (this.position.x > this.hero.position.x) {
        this.body.velocity.x = this.VELOCITY * -1;
      } else {
        this.body.velocity.x = this.VELOCITY;
      }

      if (this.position.y > this.hero.position.y) {
        this.body.velocity.y = this.VELOCITY * -1;
      } else {
        this.body.velocity.y = this.VELOCITY;
      }
    }
  }
}
