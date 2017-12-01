import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';

export class Hero extends BaseSprite {
  private ANIMATIONS = {
    WALK: 'walk',
    HURT: 'hurt',
    DIE: 'die'
  };
  private SCALE: number = 0.5;
  private isHurting: boolean = false;
  private isDying: boolean = false;
  private cursors: Phaser.CursorKeys;
  private colliders: any[];
  private attributes: IHero;
  public isRespawning: boolean = false;

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
    attributes: IHero;
  }) {
    super(game, xPos, yPos, assets.HERO);
    this.init();
    this.addToGame();
    this.colliders = colliders;
    this.attributes = attributes;
    this.health = this.maxHealth = attributes.health;

    this.events.onRevived.add(this.onRevive, this);
    // this.events.onKilled.add(this.onKilled, this);
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
    if (this.cursors.right.isDown) {
      this.body.velocity.x = this.attributes.speed;
      this.turnRight();
      this.playWalkAnimation();
    } else if (this.cursors.left.isDown) {
      this.body.velocity.x = this.attributes.speed * -1;
      this.turnLeft();
      this.playWalkAnimation();
    } else {
      this.body.velocity.x = 0;
    }

    if (this.cursors.up.isDown) {
      this.body.velocity.y = this.attributes.speed * -1;
      this.turnUp();
      this.playWalkAnimation();
    } else if (this.cursors.down.isDown) {
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
