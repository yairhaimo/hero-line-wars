import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';
import { Hero } from './hero';
import { Beacon } from './beacon';

export class Monster extends BaseSprite {
  private ANIMATIONS = {
    WALK: 'walk'
  };
  private SCALE: number = 0.5;
  private cursors: Phaser.CursorKeys;
  private colliders: any[];
  private hero: Hero;
  private beacon: Beacon;
  private map: Phaser.Tilemap;
  private pathToBeacon: { x: number; y: number }[];
  private isFollowingPath: boolean = false;
  private movingTween: Phaser.Tween;
  private isTrackingHero: boolean;
  public attributes: IMonster;

  constructor(
    public game: Game,
    {
      xPos,
      yPos,
      colliders = [],
      hero,
      beacon,
      map,
      attributes
    }: {
      xPos: number;
      yPos: number;
      colliders?: any[];
      hero: Hero;
      beacon: Beacon;
      map: Phaser.Tilemap;
      attributes: IMonster;
    }
  ) {
    super(game, xPos, yPos, assets.MONSTER);
    this.colliders = colliders;
    this.hero = hero;
    this.beacon = beacon;
    this.map = map;
    this.attributes = attributes;
    this.health = attributes.health;
    this.init();
    this.findPathToBeacon();
    this.startWalking();

    this.events.onRevived.add(() => this.onRevive, this);
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.defineAnimation();
  }

  private startWalking() {
    this.animations.play(this.ANIMATIONS.WALK);
    this.movingTween = this.game.add.tween(this);
    this.movingTween.onComplete.add(() => {
      this.isFollowingPath = false;
      this.followPathToBeacon();
    });
  }

  private defineAnimation() {
    this.animations.add(this.ANIMATIONS.WALK, [0, 1, 2, 3], 16, true);
  }

  private findPathToBeacon() {
    const startTileX = Math.floor(this.x / this.map.tileWidth);
    const startTileY = Math.floor(this.y / this.map.tileHeight);
    const endTileX = Math.floor(this.beacon.position.x / this.map.tileWidth);
    const endTileY = Math.floor(this.beacon.position.y / this.map.tileHeight);
    // console.log('calc', [startTileX, startTileY], [endTileX, endTileY]);
    const pathfinder = this.game.pathfinder;
    pathfinder.setCallbackFunction(path => {
      this.pathToBeacon = path;
    });
    pathfinder.preparePathCalculation([startTileX, startTileY], [endTileX, endTileY]);
    pathfinder.calculatePath();
  }

  private followPathToBeacon() {
    if (!this.pathToBeacon.length || this.isFollowingPath) {
      return;
    }
    const next = this.pathToBeacon.shift();
    if (!next) {
      return;
    }

    const x = next.x * this.map.tileWidth + 2;
    const y = next.y * this.map.tileHeight + 2;
    this.isFollowingPath = true;
    this.movingTween.target = this;
    this.movingTween.timeline = [];
    this.movingTween.to({ x, y }, 300);
    this.movingTween.start();
  }

  public update() {
    this.handleColliders();
    if (this.isHeroInRange()) {
      this.trackHero();
    } else if (this.isTrackingHero) {
      this.resetPathToBeacon();
    } else {
      this.followPathToBeacon();
    }
  }

  private handleColliders() {
    this.colliders.forEach(collider => this.game.physics.arcade.collide(this, collider));
  }

  private resetPathToBeacon() {
    this.isTrackingHero = false;
    this.isFollowingPath = false;
    this.findPathToBeacon();
    this.startWalking();
  }

  private trackHero() {
    this.isTrackingHero = true;
    this.movingTween.stop();
    if (this.position.x > this.hero.position.x) {
      this.body.velocity.x = this.attributes.speed * -1;
    } else {
      this.body.velocity.x = this.attributes.speed;
    }
    if (this.position.y > this.hero.position.y) {
      this.body.velocity.y = this.attributes.speed * -1;
    } else {
      this.body.velocity.y = this.attributes.speed;
    }
  }

  private isHeroInRange() {
    return (
      this.hero &&
      this.hero.alive &&
      Math.abs(this.position.x - this.hero.position.x) < this.attributes.range &&
      Math.abs(this.position.y - this.hero.position.y) < this.attributes.range
    );
  }

  private onRevive() {
    this.pathToBeacon = [];
    this.isFollowingPath = false;
    this.frame = 0;
    this.findPathToBeacon();
    this.startWalking();
  }
}
