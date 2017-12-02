import { BaseSprite } from './baseSprite';
import { assets, scale } from '../definitions';
import { Game } from '../game';
import { Hero } from './hero';
import { Beacon } from './beacon';

export class HUD {
  private SPACING = 80;
  private MARGIN = 5;
  private Y = 5;
  private healthHUD = {
    text: null,
    label: 'Health',
    index: 0,
    value: 0
  };
  private manaHUD = {
    text: null,
    label: 'Mana',
    index: 1,
    value: 0
  };
  private coinsHUD = {
    text: null,
    label: 'Coins',
    index: 2,
    value: 0
  };
  private killsHUD = {
    text: null,
    label: 'Kills',
    index: 3,
    value: 0
  };
  private xpHUD = {
    text: null,
    label: 'XP',
    index: 4,
    value: 0
  };
  private levelHUD = {
    text: null,
    label: 'Level',
    index: 5,
    value: 0
  };
  private beaconHUD = {
    text: null,
    label: 'Beacon Health',
    index: 6,
    value: 0
  };

  constructor(private game: Game, private hero: Hero, private beacon: Beacon) {
    this.updateHUD();
  }

  public updateHUD() {
    this.changeHealth(this.hero.health);
    this.changeMana(this.hero.attributes.mana);
    this.changeBeaconHealth(this.beacon.health);
    this.changeXP(this.hero.xp);
    this.changeKills(this.hero.kills);
    this.changeCoins(this.hero.coins);
    this.changeLevel(this.hero.level);
  }

  public changeHealth(health) {
    this.addHUDText(this.healthHUD, health);
  }

  public changeMana(mana) {
    this.addHUDText(this.manaHUD, mana);
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
      hudValues.text = this.addText('', hudValues.index * this.SPACING + this.MARGIN, this.Y);
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
