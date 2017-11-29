import * as Phaser from 'phaser-ce';
import { Game } from './game';
import { Boot, Win, Play, Menu, Load, Lose } from './states';

const game = new Game();

game.state.add(Boot.NAME, Boot);
game.state.add(Load.NAME, Load);
game.state.add(Menu.NAME, Menu);
game.state.add(Play.NAME, Play);
game.state.add(Lose.NAME, Lose);
game.state.add(Win.NAME, Win);

game.state.start(Boot.NAME);
