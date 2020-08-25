import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/_models/State.model';
import io from "socket.io-client";
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit {

  public state: State = new State();
  public socket: any;
  public joinForm;
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.joinForm = this.formBuilder.group({
      name: ''
    })
  }

  ngOnInit(): void {
    this.socket = io('/game');
    this.setEventListeners();
  }

  setEventListeners() {
    this.socket.on('join-success', state => {
      this.router.navigate(['../got-room-main'], { relativeTo: this.route })
    });
  }

  join(name) {
    if (!this.state.gameStarted) {
      console.log('trying to join');
      this.socket.emit('join', name);
    } else {
      console.log('game already started');
    }
  }

}
