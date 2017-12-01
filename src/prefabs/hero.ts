import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';

export class Hero extends BaseSprite {
  private VELOCITY: number = 100;
  private ANIMATIONS = {
    WALK: 'walk'
  };
  private SCALE: number = 0.5;
  private cursors: Phaser.CursorKeys;
  private colliders: any[];
  private attributes: IHero;

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
    this.health = attributes.health;
  }

  private addToGame() {
    this.game.add.existing(this);
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    // this.game.physics.arcade.enable(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.defineAnimation();
  }

  private defineAnimation() {
    this.animations.add(this.ANIMATIONS.WALK, [0, 1, 2, 3], 16, true);
  }

  private isDead() {
    return this.health <= 0;
  }

  public damage(amount: number): BaseSprite {
    super.damage(amount);
    // TODO: play get hit animation
    this.frame = 3;
    if (this.isDead()) {
      this.die();
    }
    return this;
  }

  private die() {
    const emitter = this.game.add.emitter(this.x, this.y, 100);
    emitter.makeParticles(this.assets.PARTICLE);
    emitter.minParticleSpeed.setTo(-40, -40);
    emitter.maxParticleSpeed.setTo(40, 40);
    emitter.gravity.y = 0;
    emitter.gravity.x = 0;
    emitter.start(true, 800, null, 100);
  }

  public update() {
    this.colliders.forEach(collider =>
      this.game.physics.arcade.collide(this, collider, () => this.game.camera.shake(0.0005, 200))
    );
    if (this.cursors.right.isDown) {
      this.body.velocity.x = this.VELOCITY;
      this.turnRight();
      this.animations.play(this.ANIMATIONS.WALK);
    } else if (this.cursors.left.isDown) {
      this.body.velocity.x = this.VELOCITY * -1;
      this.turnLeft();
      this.animations.play(this.ANIMATIONS.WALK);
    } else {
      this.body.velocity.x = 0;
    }

    if (this.cursors.up.isDown) {
      this.body.velocity.y = this.VELOCITY * -1;
      this.turnUp();
      this.animations.play(this.ANIMATIONS.WALK);
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = this.VELOCITY;
      this.turnDown();
      this.animations.play(this.ANIMATIONS.WALK);
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
}
