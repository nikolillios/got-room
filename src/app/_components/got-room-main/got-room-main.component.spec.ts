import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GotRoomMainComponent } from './got-room-main.component';

describe('GotRoomMainComponent', () => {
  let component: GotRoomMainComponent;
  let fixture: ComponentFixture<GotRoomMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GotRoomMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GotRoomMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
