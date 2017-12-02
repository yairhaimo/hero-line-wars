import { Hero } from '../prefabs/hero';
import { Monster } from '../prefabs/monster';
import { Beacon } from '../prefabs/beacon';
import { BaseState } from './baseState';
import { size } from '../definitions';
import { BaseSprite } from '../prefabs/baseSprite';
import { Game } from '../game';
import { Lose } from './lose';
import { HUD } from '../prefabs/HUD';
const stage: IStage = require('../data/stage0.json');

export class Play extends BaseState {
  static NAME = 'Play';
  private hero: Hero;
  private beacon: Beacon;
  private map: Phaser.Tilemap;
  private path: Phaser.TilemapLayer;
  private walls: Phaser.TilemapLayer;
  private monsters: Phaser.Group;
  private hud: HUD;

  preload() {
    console.log('play preload');
  }

  create() {
    this.createMap();
    this.configurePathfinding();
    this.createMonsterGroup();
    this.createBeacon();
    this.createHero();
    this.createMonsters();
    this.createHUD();
  }

  private createHUD() {
    this.hud = new HUD(this.game as Game, {
      health: this.hero.health,
      xp: 0,
      kills: 0,
      coins: 0,
      level: 1,
      beaconHealth: this.beacon.health
    });
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

  private createMonsterGroup() {
    this.monsters = this.game.add.group();
  }

  private createMonsters() {
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
      xPos: 100,
      yPos: 400,
      // xPos: 1600,
      // yPos: 180,
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
    this.map = this.game.add.tilemap(this.assets.MAP2);
    this.map.addTilesetImage(this.assets.ALL);
    const background = this.map.createLayer(this.assets.BACKGROUND);
    this.path = this.map.createLayer(this.assets.PATH);
    this.walls = this.map.createLayer(this.assets.WALLS);
    this.map.createLayer(this.assets.DECORATIONS);
    background.resizeWorld();
    const WALL_TILES = [
      0,
      7,
      64,
      521,
      522,
      577,
      578,
      635,
      636,
      706,
      709,
      764,
      820,
      821,
      822,
      824,
      825,
      834,
      838,
      876,
      879,
      881,
      890,
      891,
      894,
      895,
      1065,
      1179,
      1610613442,
      1610613445,
      2684355266,
      2684355269,
      2684355324,
      2684355441,
      2684355448,
      3221226178,
      3221226181,
      3221226239,
      3221226353
    ]; // check map.json for tile number
    this.map.setCollision(WALL_TILES, true, this.assets.WALLS);
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
    this.hud.changeHealth(this.hero.health);
  }

  update() {
    this.physics.arcade.collide(this.hero, this.monsters, this.damageHero, null, this);
    this.physics.arcade.overlap(this.beacon, this.monsters, this.damageBeacon, null, this);
    this.physics.arcade.overlap(this.monsters, this.hero.weapon.bullets, this.damageMonster, null, this);
  }

  private gameOver() {
    this.camera.fade(0, Phaser.Timer.SECOND * 3.1);
    this.game.time.events.add(Phaser.Timer.SECOND * 3, () => this.game.state.start(Lose.NAME), this);
  }

  private damageHero(hero: Hero, monster: Monster) {
    hero.damage(monster.attributes.damage);
    this.hud.changeHealth(this.hero.health);
    monster.kill();
  }

  private damageBeacon(beacon: Beacon, monster: Monster) {
    beacon.damage(monster.attributes.damage);
    this.hud.changeBeaconHealth(this.beacon.health);
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
