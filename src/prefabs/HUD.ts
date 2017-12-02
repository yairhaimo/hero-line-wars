import { BaseSprite } from './baseSprite';
import { assets, scale } from '../definitions';
import { Game } from '../game';

export class HUD {
  private healthHUD = {
    text: null,
    label: 'Health',
    x: 5,
    y: 5,
    value: 0
  };
  private coinsHUD = {
    text: null,
    label: 'Coins',
    x: 85,
    y: 5,
    value: 0
  };
  private killsHUD = {
    text: null,
    label: 'Kills',
    x: 165,
    y: 5,
    value: 0
  };
  private xpHUD = {
    text: null,
    label: 'XP',
    x: 245,
    y: 5,
    value: 0
  };
  private levelHUD = {
    text: null,
    label: 'Level',
    x: 325,
    y: 5,
    value: 0
  };
  private beaconHUD = {
    text: null,
    label: 'Beacon Health',
    x: 405,
    y: 5,
    value: 0
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
    this.addHUDText(this.healthHUD, health);
  }

  public changeBeaconHealth(health) {
    this.addHUDText(this.beaconHUD, health);
  }

  public changeCoins(coins) {
    this.addHUDText(this.coinsHUD, coins);
  }

  public changeXP(xp) {
    this.addHUDText(this.xpHUD, xp);
  }

  public changeKills(kills) {
    this.addHUDText(this.killsHUD, kills);
  }

  public changeLevel(level) {
    this.addHUDText(this.levelHUD, level);
  }

  private addHUDText(hudValues, value) {
    if (!hudValues.text) {
      hudValues.text = this.addText('', hudValues.x, hudValues.y);
    }
    hudValues.text.setText(`${hudValues.label}: ${value}`);
    hudValues.value = value;
  }

  private addText(text, x, y) {
    const hudText = this.game.add.text(x, y, text, { font: '10px Arial', fill: '#000' });
    hudText.fixedToCamera = true;
    return hudText;
  }
}
