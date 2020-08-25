import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  value: number;
  nums: number[];
  offset: number;
  colors: string[] = ['red', 'lightblue', 'yellow', 'purple', 'lightgreen']; //<<< Choose colors for spinner
  minSpin: number = 1080;
  maxSpin: number = 3600;
  buttonActive: boolean = true;
  @Output() public numberChosen = new EventEmitter();
  @Output() buttonEnabled = new EventEmitter<boolean>();

  @Input('isClickable')
  set clickable(b: boolean) {
    this.setButton(b);
  }

  constructor() {
    this.nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //<<< Choose values for spinner 
  }

  ngOnInit(): void {
    this.offset = 0;
  }

  ngAfterViewInit() {
    this.styleSpinner();
  }

  setButton(b: boolean) {
    var button = <HTMLButtonElement>document.getElementById("button")
    button.disabled = !b;
    this.buttonActive = b;
    this.buttonEnabled.emit(b);
  }

  styleSpinner() {
    let percentDisplacement = Math.tan(this.sectorAngle('rad') / 2) * 100;
    let p1 = percentDisplacement + 50;
    let p2 = -percentDisplacement + 50;
    for (let i = 0; i < this.nums.length; i++) {
      var section = document.getElementById(i.toString());
      section.style.clipPath = `polygon(0 ${p1}%, 100% 50%, 0 ${p2}%)`;
      section.style.backgroundColor = this.backgroundColor(i);
      section.style.top = '25%';
      section.style.left = '0%';
      section.style.transformOrigin = '100% 50%'
      section.style.transform = 'rotate(' + (-i * 360 / this.nums.length).toString() + 'deg)';
    }
  }

  sectorAngle(mode: string) {
    if (mode == 'rad') {
      return 2 * Math.PI / this.nums.length;
    } else if (mode == 'deg') {
      return 360 / this.nums.length;
    }
    return null;
  }

  backgroundColor(index: number) {
    return this.colors[index % this.colors.length];
  }

  spinWheel() {
    var t = Math.floor(Math.random() * (this.maxSpin - this.minSpin)) + this.minSpin;
    var rotation = t + this.offset;
    var wheel = document.getElementById("wheel");

    // to ensure ticker is pointing at correct section while ensuring wheel 
    // result is fair
    let errorMargin = 3;
    let angle = this.sectorAngle('deg');
    if (((rotation + angle / 2) % angle) < errorMargin) {
      rotation += errorMargin;
    } else if (((rotation + angle / 2) % angle) > angle - errorMargin) {
      rotation -= errorMargin;
    }
    wheel.style.transform = "rotate(" + rotation + "deg)";
    this.offset = rotation;
    var result = (rotation + angle / 2) % 360;
    console.log('result: ' + this.nums[Math.floor(result / 360 * this.nums.length)])
    this.numberChosen.emit(this.nums[Math.floor(result / 360 * this.nums.length)]);
  }
}

