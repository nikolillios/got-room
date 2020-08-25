import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import io from "socket.io-client"
import { State } from "../../_models/State.model"

@Component({
  selector: 'gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit {

  @Output() selected = new EventEmitter<any>();
  @Input() state: State = new State();
  @Input() socketId: string;

  constructor() { }

  ngOnInit(): void {
  }

  registerClick(row: number, column: number) {
    this.selected.emit({ row: row, column: column });
  }

  mouseOver(row, column) {
    let coords =
      this.getPlayerWithId(this.socketId).turns[this.state.turn].selection.coords;
    if (this.isCurrPlayer(this.socketId) && coords.length == 1) {
      let hoverCoord = { x: row, y: column };
      let minX = Math.min(coords[0].x, hoverCoord.x);
      let maxX = Math.max(coords[0].x, hoverCoord.x);
      let minY = Math.min(coords[0].y, hoverCoord.y);
      let maxY = Math.max(coords[0].y, hoverCoord.y);
      for (let i = minY; i < maxY; i++) {
        for (let j = minX; j < maxX; j++) {
          if (!this.state.tiles[i][j].marked) {
            let elem = document.getElementById(`cell-${i}-${j}`);
            elem.classList
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
