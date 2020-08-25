import { Player } from "./Player.model";
import { Tile } from "./Tile.model";

export class State {
  public tiles: Array<Array<Tile>>;
  public players: Array<Player>;
  public gameStarted: boolean;
  public score: Array<number>;
  public turn: number;
  constructor() {
    this.tiles = [];
    this.players = [];
    this.gameStarted = false;
    this.score = [];
    this.turn = 0;
  }
}