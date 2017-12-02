import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';
import { Monster } from './monster';

export class Hero extends BaseSprite {
  private ANIMATIONS = {
    WALK: 'walk',
    HURT: 'hurt',
    DIE: 'die'
  };
  private SCALE: number = 1;
  private isHurting: boolean = false;
  private isDying: boolean = false;
  private cursors: Phaser.CursorKeys;
  private colliders: any[];
  private monsters: Phaser.Group;
  private get canShoot() {
    return this.attributes.range > 0;
  }
  public attributes: IHero;
  public isRespawning: boolean = false;
  public weapon: Phaser.Weapon;

  constructor(
    public game: Game,
    {
      xPos,
      yPos,
      colliders = [],
      monsters,
      attributes
    }: {
      xPos: number;
      yPos: number;
      colliders?: any[];
      monsters: Phaser.Group;
      attributes: IHero;
    }
  ) {
    super(game, xPos, yPos, assets.HERO);
    this.init();
    this.addToGame();
    this.colliders = colliders;
    this.attributes = attributes;
    this.health = this.maxHealth = attributes.health;
    this.monsters = monsters;
    console.log(this.monsters);

    this.events.onRevived.add(this.onRevive, this);
    // this.events.onKilled.add(this.onKilled, this);

    this.configureWeapon();

    // this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(() => {
    //   const closestMonster = this.getClosestMonster();

    //   console.log(
    //     'monsters',
    //     this.monsters.children.map(child => ({ x: child.x, y: child.y })),
    //     'closest',
    //     { x: closestMonster.x, y: closestMonster.y },
    //     'hero',
    //     { x: this.x, y: this.y }
    //   );
    // }, this);
  }

  private configureWeapon() {
    this.weapon = this.game.add.weapon(30, this.assets.PARTICLE);
    this.weapon.bulletSpeed = 300;
    this.weapon.fireRate = 50;
    this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    this.weapon.bulletKillDistance = this.attributes.range;
    this.weapon.trackSprite(this, 0, 0);
    // this.weapon.
  }

  private getClosestMonster() {
    const sortedByDistance = this.monsters.children.sort(
      (a, b) => this.x - a.x + this.y - a.y - (this.x - b.x + this.y - b.y)
    );
    console.log(sortedByDistance.map(child => ({ x: child.x, y: child.y })));
    return sortedByDistance[0];
  }

  private addToGame() {
    this.game.add.existing(this);
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.defineAnimations();
  }

  private defineAnimations() {
    this.animations.add(this.ANIMATIONS.WALK, [0, 1, 2, 3], 16, true);
    this.animations.add(this.ANIMATIONS.HURT, [0, 4], 6, false);
    this.animations.add(this.ANIMATIONS.DIE, [0, 4, 5, 5, 5], 6, false);
  }

  public damage(amount: number): BaseSprite {
    super.damage(amount);
    if (this.health > 0) {
      this.isHurting = true;
      const hurtAnimation = this.animations.play(this.ANIMATIONS.HURT);
      hurtAnimation.onComplete.add(() => (this.isHurting = false));
    }
    return this;
  }

  private die(cb) {
    this.stopMoving();
    this.turnRight();
    const deathAnimation = this.animations.play(this.ANIMATIONS.DIE);
    deathAnimation.onComplete.add(() => {
      const emitter = this.game.add.emitter(this.x, this.y, 80);
      emitter.makeParticles(this.assets.PARTICLE);
      emitter.minParticleSpeed.setTo(-80, -80);
      emitter.maxParticleSpeed.setTo(80, 80);
      emitter.gravity.y = 0;
      emitter.gravity.x = 0;
      emitter.start(true, 800, null, 100);
      cb();
    });
  }

  private stopMoving() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  public update() {
    if (this.isDying) {
      return;
    }
    this.colliders.forEach(collider =>
      this.game.physics.arcade.collide(this, collider, () => this.game.camera.shake(0.0005, 200))
    );
    this.handleMovement();
    if (this.cursors.right.isDown) {
      this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
      this.turnRight();
      this.weapon.fire();
    } else if (this.cursors.up.isDown) {
      this.weapon.fireAngle = Phaser.ANGLE_UP;
      this.turnUp();
      this.weapon.fire();
    } else if (this.cursors.left.isDown) {
      this.weapon.fireAngle = Phaser.ANGLE_LEFT;
      this.turnLeft();
      this.weapon.fire();
    } else if (this.cursors.down.isDown) {
      this.weapon.fireAngle = Phaser.ANGLE_DOWN;
      this.turnDown();
      this.weapon.fire();
    }
    // const closestMonster = this.getClosestMonster();
    // if (this.position.x > closestMonster.x) {
    //   this.body.velocity.x = this.attributes.speed * -1;
    // } else {
    //   this.body.velocity.x = this.attributes.speed;
    // }
    // if (this.position.y > closestMonster.y) {
    //   this.body.velocity.y = this.attributes.speed * -1;
    // } else {
    //   this.body.velocity.y = this.attributes.speed;
    // }
  }

  private handleMovement() {
    if (this.game.input.keyboard.addKey(Phaser.KeyCode.D).isDown) {
      this.body.velocity.x = this.attributes.speed;
      this.turnRight();
      this.playWalkAnimation();
    } else if (this.game.input.keyboard.addKey(Phaser.KeyCode.A).isDown) {
      this.body.velocity.x = this.attributes.speed * -1;
      this.turnLeft();
      this.playWalkAnimation();
    } else {
      this.body.velocity.x = 0;
    }
    if (this.game.input.keyboard.addKey(Phaser.KeyCode.W).isDown) {
      this.body.velocity.y = this.attributes.speed * -1;
      this.turnUp();
      this.playWalkAnimation();
    } else if (this.game.input.keyboard.addKey(Phaser.KeyCode.S).isDown) {
      this.body.velocity.y = this.attributes.speed;
      this.turnDown();
      this.playWalkAnimation();
    } else {
      this.body.velocity.y = 0;
    }
    if (
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown &&
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown
    ) {
      this.frame = 0;
    }
  }

  private playWalkAnimation() {
    if (!this.isHurting) {
      this.animations.play(this.ANIMATIONS.WALK);
    }
  }

  kill(): BaseSprite {
    console.log('killed');
    this.isDying = true;
    this.die(() => super.kill());
    return this;
  }

  private turnLeft() {
    this.scale.setTo(this.SCALE * -1, this.SCALE);
    this.angle = 0;
  }

  private turnRight() {
    this.scale.setTo(this.SCALE);
    this.angle = 0;
  }

  private turnUp() {
    this.turnRight();
    this.angle = -90;
  }

  private turnDown() {
    this.turnRight();
    this.angle = 90;
  }

  private onRevive() {
    this.isHurting = false;
    this.isDying = false;
    this.isRespawning = false;
    this.frame = 0;
  }
}
