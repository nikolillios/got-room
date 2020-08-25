import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { State } from 'src/app/_models/State.model';
import io from "socket.io-client";
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'got-room-main',
  templateUrl: './got-room-main.component.html',
  styleUrls: ['./got-room-main.component.scss']
})
export class GotRoomMainComponent implements OnInit {

  @Input() state: State = new State();
  @ViewChild('die') fakeDie: ElementRef;
  @Input() socket: any;
  public joinForm;
  public joined: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.joinForm = this.formBuilder.group({
      name: ''
    })
  }

  ngOnInit(): void {
    this.socket = io('/game')
    this.setEventListeners();
  }

  join(name) {
    if (!this.state.gameStarted) {
      console.log('trying to join');
      this.socket.emit('join', name);
    } else {
      console.log('game already started');
    }
  }

  setEventListeners() {
    this.socket.on('join-success', state => {
      this.state = state;
      this.joined = true;
    });
    // handle update
    this.socket.on('update', data => {
      console.log('UPDATE');
      console.log(data);
      this.state = data;
    });
    // message
    this.socket.on('message', message => {
      console.log('MESSAGE: ' + message);
    })
  }

  submit() {
    let value = this.fakeDie.nativeElement.value;
    console.log('value: ' + value);
    this.socket.emit('dice-roll', value);
  }

  registerSpin(value) {
    this.socket.emit('dice-roll', value);
  }

  startGame() {
    this.socket.emit('start-game');
  }

  playAgain() {
    this.socket.emit('play-again');
  }

  registerSelection(coordinate) {
    this.socket.emit('board-selection', coordinate);
  }

}
