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
    this.createMonsters();
    this.createHero();
  }

  private configurePathfinding() {
    (this.game as Game).pathfinder.setGrid(this.map.layers[1].data, [-1]);
  }

  private createBeacon() {
    this.beacon = new Beacon({
      xPos: stage.beacon.position.x,
      yPos: stage.beacon.position.y,
      game: this.game as Game,
      attributes: {
        health: stage.beacon.health
      }
    });
    this.beacon.events.onKilled.add(this.gameOver, this);
  }

  private createMonsters() {
    this.monsters = this.game.add.group();
    this.createMonster();
    this.game.time.events.loop(Phaser.Timer.SECOND * stage.monsters.interval, this.createMonster, this);
  }

  private createMonster() {
    let monster: BaseSprite = this.monsters.getFirstDead();
    console.log('num of monsters', this.monsters.children.length);
    if (!monster) {
      monster = new Monster(this.game as Game, {
        xPos: stage.monsters.startPosition.x + this.game.rnd.integerInRange(-20, 20),
        yPos: stage.monsters.startPosition.y + this.game.rnd.integerInRange(-20, 20),
        colliders: [this.walls],
        hero: this.hero,
        map: this.map,
        beacon: this.beacon,
        attributes: {
          damage: stage.monsters.damage,
          health: stage.monsters.health,
          mana: stage.monsters.mana,
          range: stage.monsters.range,
          speed: stage.monsters.speed
        }
      });
      this.monsters.add(monster);
    } else {
      monster.revive();
      monster.reset(stage.monsters.startPosition.x, stage.monsters.startPosition.y, stage.monsters.health);
    }
  }

  private createHero() {
    this.hero = new Hero(this.game as Game, {
      // xPos: 100,
      // yPos: 385,
      xPos: 2200,
      yPos: 150,
      colliders: [this.walls],
      monsters: this.monsters,
      attributes: {
        health: 30,
        damage: 10,
        mana: 100,
        range: 100,
        speed: 400
      }
    });
    this.camera.follow(this.hero);
    this.hero.events.onKilled.add(this.startHeroRespawn, this);
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
    if (!this.hero.alive && !this.hero.isRespawning) {
      this.hero.isRespawning = true;
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.respawnHero, this);
    }
  }

  private respawnHero() {
    this.hero.revive();
    this.hero.reset(this.beacon.x, this.beacon.y, this.hero.maxHealth);
  }

  update() {
    this.physics.arcade.collide(this.hero, this.monsters, this.damageHero);
    this.physics.arcade.overlap(this.beacon, this.monsters, this.damageBeacon);
    this.physics.arcade.overlap(this.monsters, this.hero.weapon.bullets, this.damageMonster, null, this);
  }

  private gameOver() {
    this.camera.fade(0, Phaser.Timer.SECOND * 3.1);
    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => this.game.state.start(Lose.NAME), this);
  }

  private damageHero(hero: Hero, monster: Monster) {
    hero.damage(monster.attributes.damage);
    monster.kill();
  }

  private damageBeacon(beacon: Beacon, monster: Monster) {
    beacon.damage(monster.attributes.damage);
    monster.kill();
  }

  private damageMonster(monster: Monster, bullet) {
    bullet.kill();
    monster.damage(this.hero.attributes.damage);
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
