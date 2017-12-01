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
  private attributes: IMonster;
  private beacon: Beacon;
  private map: Phaser.Tilemap;

  constructor(
    public game: Game,
    {
      game2,
      xPos,
      yPos,
      colliders = [],
      hero,
      beacon,
      map,
      attributes
    }: {
      game2: Game;
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
    this.init();
    this.colliders = colliders;
    this.hero = hero;
    this.beacon = beacon;
    this.map = map;
    this.attributes = attributes;
    this.health = attributes.health;
    this.findPathToBeacon();
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.defineAnimation();
    this.animations.play(this.ANIMATIONS.WALK);
  }

  private defineAnimation() {
    this.animations.add(this.ANIMATIONS.WALK, [0, 1, 2, 3], 16, true);
  }

  private findPathToBeacon() {
    const startTileX = Math.floor(this.x / this.map.tileWidth);
    const startTileY = Math.floor(this.y / this.map.tileHeight);
    const endTileX = Math.floor(this.beacon.position.x / this.map.tileWidth);
    const endTileY = Math.floor(this.beacon.position.y / this.map.tileHeight);
    console.log('calc', [startTileX, startTileY], [endTileX, endTileY]);
    const pathfinder = this.game.pathfinder;
    pathfinder.setCallbackFunction(path => {
      console.log('path is', path);
    });
    pathfinder.preparePathCalculation([startTileX, startTileY], [endTileX, endTileY]);
    pathfinder.calculatePath();
  }

  public update() {
    this.colliders.forEach(collider => this.game.physics.arcade.collide(this, collider));
    // go to beacon according to path
    // if close to player, attack player
    // if attacked by player go to player

    if (this.hero.alive) {
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
    this.goToBeacon();
  }

  private goToBeacon() {
    if (this.position.x > this.beacon.position.x) {
      this.body.velocity.x = this.attributes.speed * -1;
    } else {
      this.body.velocity.x = this.attributes.speed;
    }
    if (this.position.y > this.beacon.position.y) {
      this.body.velocity.y = this.attributes.speed * -1;
    } else {
      this.body.velocity.y = this.attributes.speed;
    }
  }
}
