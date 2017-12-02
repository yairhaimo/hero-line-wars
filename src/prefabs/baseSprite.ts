import { assets } from '../definitions';

export class BaseSprite extends Phaser.Sprite {
  assets: { [key: string]: string } = assets;
  protected SCALE: number = 1;

  protected normalizeDirection() {
    this.scale.setTo(this.SCALE);
  }

  protected flipDirection() {
    this.scale.setTo(this.SCALE * -1, this.SCALE);
  }

  protected turnLeft() {
    this.flipDirection();
    this.angle = Phaser.ANGLE_LEFT;
  }

  protected turnRight() {
    this.normalizeDirection();
    this.angle = Phaser.ANGLE_RIGHT;
  }

  protected turnUp() {
    this.normalizeDirection();
    this.angle = Phaser.ANGLE_UP;
  }

  protected turnDown() {
    this.normalizeDirection();
    this.angle = Phaser.ANGLE_DOWN;
  }

  protected stopMoving() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }
}
