import { BaseSprite } from './baseSprite';
import { assets } from '../definitions';
import { Game } from '../game';

export class Hero extends BaseSprite {
  private VELOCITY: number = 100;
  private ANIMATIONS = {
    WALK: 'walk'
  };
  private SCALE: number = 0.5;

  constructor({ game, xPos, yPos }: { game: Game; xPos: number; yPos: number }) {
    super(game, xPos, yPos, assets.HERO);
    this.init();
    this.addToGame();
  }

  private addToGame() {
    this.game.add.existing(this);
  }

  private init() {
    this.anchor.setTo(0.5);
    this.scale.setTo(this.SCALE);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.defineAnimation();
  }

  private defineAnimation() {
    this.animations.add(this.ANIMATIONS.WALK, [0, 1, 2, 3], 16, true);
  }

  public update() {
    const cursor = this.game.input.keyboard.createCursorKeys();

    if (cursor.right.isDown) {
      this.body.velocity.x = this.VELOCITY;
      this.turnRight();
      this.animations.play(this.ANIMATIONS.WALK);
    } else if (cursor.left.isDown) {
      this.body.velocity.x = this.VELOCITY * -1;
      this.turnLeft();
      this.animations.play(this.ANIMATIONS.WALK);
    } else {
      this.body.velocity.x = 0;
    }

    if (cursor.up.isDown) {
      this.body.velocity.y = this.VELOCITY * -1;
      this.turnUp();
      this.animations.play(this.ANIMATIONS.WALK);
    } else if (cursor.down.isDown) {
      this.body.velocity.y = this.VELOCITY;
      this.turnDown();
      this.animations.play(this.ANIMATIONS.WALK);
    } else {
      this.body.velocity.y = 0;
    }

    if (!cursor.up.isDown && !cursor.down.isDown && !cursor.left.isDown && !cursor.right.isDown) {
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
