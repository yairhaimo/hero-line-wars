import { Hero } from '../prefabs/hero';
import { Monster } from '../prefabs/monster';
import { Beacon } from '../prefabs/beacon';
import { BaseState } from './baseState';
import { size } from '../definitions';
import { BaseSprite } from '../prefabs/baseSprite';
import { Game } from '../game';
import { Lose } from './lose';
const stage: IStage = require('../data/stage0.json');

export class Play extends BaseState {
  static NAME = 'Play';
  private hero: Hero;
  private beacon: Beacon;
  private map: Phaser.Tilemap;
  private roads: Phaser.TilemapLayer;
  private walls: Phaser.TilemapLayer;
  private monsters: Phaser.Group;

  preload() {
    console.log('play preload');
  }

  create() {
    this.createMap();
    this.configurePathfinding();
    this.createBeacon();
    this.createHero();
    this.createMonsters();
  }

  private configurePathfinding() {
    (this.game as Game).pathfinder.setGrid(this.map.layers[0].data, [1]);
  }

  private createBeacon() {
    this.beacon = new Beacon({
      xPos: stage.beacon.position.x,
      yPos: stage.beacon.position.y,
      game: this.game as Game,
      attributes: {
        health: 1000
      }
    });
  }

  private createMonsters() {
    this.monsters = this.game.add.group();
    this.createMonster();
    this.game.time.events.loop(Phaser.Timer.SECOND * stage.monsters.interval, this.createMonster, this);
  }

  private createMonster() {
    let monster: BaseSprite = this.monsters.getFirstDead();
    console.log('num of monsters', this.monsters.children);
    if (!monster) {
      monster = new Monster(this.game as Game, {
        game2: this.game as Game,
        xPos: stage.monsters.startPosition.x,
        yPos: stage.monsters.startPosition.y,
        colliders: [this.walls],
        hero: this.hero,
        map: this.map,
        beacon: this.beacon,
        attributes: {
          damage: stage.monsters.damage,
          health: stage.monsters.health,
          range: stage.monsters.range,
          speed: stage.monsters.speed
        }
      });
      this.monsters.add(monster);
    } else {
      monster.reset(stage.monsters.startPosition.x, stage.monsters.startPosition.y);
    }
  }

  private createHero() {
    this.hero = new Hero({
      game: this.game as Game,
      xPos: 100,
      yPos: 385,
      // xPos: 2200,
      // yPos: 150,
      colliders: [this.walls],
      attributes: {
        health: 30,
        damage: 10,
        range: 100,
        speed: 200
      }
    });
    this.camera.follow(this.hero);
  }

  private createMap() {
    this.map = this.game.add.tilemap(this.assets.MAP);
    this.map.addTilesetImage(this.assets.ROAD);
    this.map.addTilesetImage(this.assets.WALL);
    this.roads = this.map.createLayer(this.assets.ROAD);
    this.walls = this.map.createLayer(this.assets.WALL);
    this.roads.resizeWorld();
    const WALL_TILE = 2; // check map.json for tile number
    this.map.setCollision(WALL_TILE, true, this.assets.WALL);
  }

  private startHeroRespawn() {
    this.hero.isRespawning = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.respawnHero, this);
  }

  private respawnHero() {
    this.hero.revive();
    this.hero.reset(100, 385, 30);
    this.camera.focusOnXY(100, 385);
  }

  update() {
    this.physics.arcade.collide(this.hero, this.monsters, this.damageHero);
    this.physics.arcade.overlap(this.beacon, this.monsters, this.damageBeacon);
    if (!this.beacon.alive) {
      this.camera.fade(0, Phaser.Timer.SECOND * 3.1);
      this.game.time.events.add(Phaser.Timer.SECOND * 3, () => this.game.state.start(Lose.NAME), this);
    }
    if (!this.hero.alive && !this.hero.isRespawning) {
      this.startHeroRespawn();
    }
  }

  private damageHero(hero, monster) {
    hero.damage(monster.attributes.damage);
    monster.kill();
  }

  private damageBeacon(beacon, monster) {
    console.log('damage beacon');
    beacon.damage(monster.attributes.damage);
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
