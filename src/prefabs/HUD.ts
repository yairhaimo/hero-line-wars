import { BaseSprite } from './baseSprite';
import { assets, scale } from '../definitions';
import { Game } from '../game';

export class HUD implements IHUD {
  private coinsText: Phaser.Text;
  private healthText: Phaser.Text;
  private xpText: Phaser.Text;
  private killsText: Phaser.Text;
  private levelText: Phaser.Text;
  private beaconHealthText: Phaser.Text;
  public coins: number;
  public xp: number;
  public level: number;
  public kills: number;
  public health: number;
  public beaconHealth: number;
  private healthHUD = {
    baseText: 'Health:',
    x: 5,
    y: 5
  };
  private coinsHUD = {
    baseText: 'Coins:',
    x: 85,
    y: 5
  };
  private killsHUD = {
    baseText: 'Kills:',
    x: 165,
    y: 5
  };
  private xpHUD = {
    baseText: 'XP:',
    x: 245,
    y: 5
  };
  private levelHUD = {
    baseText: 'Level:',
    x: 325,
    y: 5
  };
  private beaconHUD = {
    baseText: 'Beacon Health:',
    x: 405,
    y: 5
  };

  constructor(private game: Game, { health, coins, xp, kills, level, beaconHealth }) {
    this.changeHealth(health);
    this.changeCoins(coins);
    this.changeXP(xp);
    this.changeKills(kills);
    this.changeLevel(level);
    this.changeBeaconHealth(beaconHealth);
  }

  public changeHealth(health) {
    this.healthText = this.addHUDText(this.healthHUD, health);
    this.health = health;
  }

  public changeBeaconHealth(health) {
    this.beaconHealthText = this.addHUDText(this.beaconHUD, health);
    this.beaconHealth = health;
  }

  public changeCoins(coins) {
    this.coinsText = this.addHUDText(this.coinsHUD, coins);
    this.coins = coins;
  }

  public changeXP(xp) {
    this.xpText = this.addHUDText(this.xpHUD, xp);
    this.xp = xp;
  }

  public changeKills(kills) {
    this.killsText = this.addHUDText(this.killsHUD, kills);
    this.kills = kills;
  }

  public changeLevel(level) {
    this.levelText = this.addHUDText(this.levelHUD, level);
    this.level = level;
  }

  private addHUDText(hudValues, extraText?: string) {
    return this.addText(
      `${hudValues.baseText}${typeof extraText !== 'undefined' ? ' ' + extraText : ''}`,
      hudValues.x,
      hudValues.y
    );
  }

  private addText(text, x, y) {
    const hudText = this.game.add.text(x, y, text, { font: '10px Arial', fill: '#000' });
    hudText.fixedToCamera = true;
    return hudText;
  }
}
