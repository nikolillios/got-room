import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import io from "socket.io-client"
import { State } from "../../_models/State.model"
import { Coordinate } from 'src/app/_models/Coordinate.model';

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit {

  @Output() selected = new EventEmitter<any>();
  @Input() state: State = new State();
  @Input() socketId: string;
  public selectionDimensions: Array<number> = [0, 0];

  constructor() { }

  ngOnInit(): void {
  }

  registerClick(row: number, column: number) {
    let coords =
      this.getPlayerWithId(this.socketId).turns[this.state.turn].selection.coords;
    this.selected.emit({ row: row, column: column });
    if (coords == undefined) { return; }
    if (this.isCurrPlayer(this.socketId) && coords.length == 1) {
      this.clearHover();
    }
  }

  clearHover() {
    for (let i = 0; i < this.state.tiles.length; i++) {
      for (let j = 0; j < this.state.tiles[0].length; j++) {
        let elem = <HTMLElement>document.getElementById(`td-${i}-${j}`);
        elem.classList.remove('hover');
      }
    }
  }

  mouseOver(row, column) {
    this.clearHover();
    let coords =
      this.getPlayerWithId(this.socketId).turns[this.state.turn].selection.coords;
    if (coords == undefined || coords.length != 1) { return; }
    if (this.isCurrPlayer(this.socketId)) {
      let hoverCoord = { x: column, y: row };
      this.selectionDimensions = [Math.abs(coords[0].y - hoverCoord.y) + 1, Math.abs(coords[0].x - hoverCoord.x) + 1]
      console.log('coord1: ' + JSON.stringify(coords[0]))
      console.log('hover coord: ' + JSON.stringify(hoverCoord));
      let minX = Math.min(coords[0].x, hoverCoord.x);
      let maxX = Math.max(coords[0].x, hoverCoord.x);
      let minY = Math.min(coords[0].y, hoverCoord.y);
      let maxY = Math.max(coords[0].y, hoverCoord.y);
      for (let i = minY; i <= maxY; i++) {
        for (let j = minX; j <= maxX; j++) {
          if (!this.state.tiles[i][j].marked) {
            let elem = document.getElementById(`td-${i}-${j}`);
            elem.className = 'hover';
          }
        }
      }
    }
  }

  isCurrPlayer(id) {
    return this.getPlayerWithId(id) ? this.getPlayerWithId(id).isCurrPlayer : false;
  }

  getPlayerWithId(id) {
    for (let i = 0; i < this.state.players.length; i++) {
      if (this.state.players[i].id == id) {
        return this.state.players[i];
      }
    }
    return undefined;
  }

  rows() {
    return this.state ? Array.from(this.state.tiles.keys()) : []
  }

  columns() {
    return this.state ? Array.from(this.state.tiles[0].keys()) : []
  }

}
