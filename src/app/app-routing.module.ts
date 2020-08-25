import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GotRoomMainComponent } from './_components/got-room-main/got-room-main.component';
import { NameFormComponent } from './_components/name-form/name-form.component';

const routes: Routes = [
  { path: 'got-room-main', component: GotRoomMainComponent },
  { path: 'name-form', component: NameFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
