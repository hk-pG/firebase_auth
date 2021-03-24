"use strict";
class Explosion extends Character {
	constructor(c, x, y, vx, vy) {
		super(0, x, y, vx, vy);
		this.timer = c;
	}

	update() {
		if (this.timer) {
			this.timer--;
			return;
		}
		super.update();
	}

	draw() {
		if (this.timer) {
			return;
		}
		this.snum = 16 + (this.count >> 4);
		if (this.snum == 27) {
			this.kill = true;
			return;
		}
		super.draw();
	}
}
