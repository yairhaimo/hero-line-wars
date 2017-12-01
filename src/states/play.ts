import { Hero } from '../prefabs/hero';
import { Monster } from '../prefabs/monster';
import { BaseState } from './baseState';
import { size } from '../definitions';
import { BaseSprite } from '../prefabs/baseSprite';

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
    this.game.time.events.loop(Phaser.Timer.SECOND * 1, this.createMonster, this);
  }

  private createMonster() {
    let monster: BaseSprite = this.monsters.getFirstDead();
    if (!monster) {
      monster = new Monster({
        game: this.game,
        xPos: 2400,
        yPos: 150,
        colliders: [this.walls],
        hero: this.hero
      });
      this.monsters.add(monster);
    } else {
      monster.reset(2400, 150);
    }
    // this.game.add.existing(monster);

    // const monster2 = new Monster({
    //   game: this.game,
    //   xPos: 2400,
    //   yPos: 615,
    //   colliders: [this.walls]
    // });
    // this.game.add.existing(monster2);
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
        health: 30
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
    map.setCollision(2, true, this.assets.WALL);
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
