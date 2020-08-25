import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GotRoomMainComponent } from './_components/got-room-main/got-room-main.component';
import { GameboardComponent } from './_components/gameboard/gameboard.component';
import { NameFormComponent } from './_components/name-form/name-form.component';
import { SpinnerComponent } from './_components/spinner/spinner.component';
import { ScoreCardComponent } from './_components/score-card/score-card.component'

@NgModule({
  declarations: [
    AppComponent,
    GotRoomMainComponent,
    GameboardComponent,
    NameFormComponent,
    SpinnerComponent,
    ScoreCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
