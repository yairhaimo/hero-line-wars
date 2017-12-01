import { Hero } from '../prefabs/hero';
import { Monster } from '../prefabs/monster';
import { BaseState } from './baseState';
import { size } from '../definitions';
import { BaseSprite } from '../prefabs/baseSprite';
const stage: IStage = require('../data/stage0.json');

export class Play extends BaseState {
  static NAME = 'Play';
  private hero: Hero;
  private roads: Phaser.TilemapLayer;
  private walls: Phaser.TilemapLayer;
  private monsters: Phaser.Group;

  preload() {
    console.log('play preload');
  }

  create() {
    this.createMap();
    this.createHero();
    this.monsters = this.game.add.group();
    this.createMonster();
    this.game.time.events.loop(Phaser.Timer.SECOND * stage.monsters.interval, this.createMonster, this);
  }

  private createMonster() {
    let monster: BaseSprite = this.monsters.getFirstDead();
    if (!monster) {
      monster = new Monster({
        game: this.game,
        xPos: stage.monsters.start.x,
        yPos: stage.monsters.start.y,
        colliders: [this.walls],
        hero: this.hero
      });
      this.monsters.add(monster);
    } else {
      monster.reset(stage.monsters.start.x, stage.monsters.start.y);
    }
  }

  private createHero() {
    this.hero = new Hero({
      game: this.game,
      // xPos: 100,
      // yPos: 385,
      xPos: 2200,
      yPos: 150,
      colliders: [this.walls],
      attributes: {
        health: 30,
        damage: 10,
        range: 100
      }
    });
    this.camera.follow(this.hero);
  }

  private createMap() {
    const map = this.game.add.tilemap(this.assets.MAP);
    map.addTilesetImage(this.assets.ROAD);
    map.addTilesetImage(this.assets.WALL);
    this.roads = map.createLayer(this.assets.ROAD);
    this.walls = map.createLayer(this.assets.WALL);
    this.roads.resizeWorld();
    const WALL_TILE = 2; // check map.json for tile number
    map.setCollision(WALL_TILE, true, this.assets.WALL);
  }

  update() {
    this.physics.arcade.collide(this.hero, this.monsters, this.damageHero);
  }

  private damageHero(hero, monster) {
    hero.damage(10);
    monster.kill();
  }

  // render() {
  //   // need to change from webgl to canvas
  //   const zone = this.game.camera.deadzone;
  //   this.game.context.fillStyle = 'rgba(255,0,0,0.6)';
  //   this.game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
  //   this.game.debug.cameraInfo(this.game.camera, 32, 32);
  //   this.game.debug.spriteCoords(this.hero, 32, 500);
  // }
}
