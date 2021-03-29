"use strict";

class Character {
	constructor(snum, x, y, vx, vy) {
		this.snum = snum;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.kill = false;
		this.count = 0;
	}

	update() {
		this.count++;
		this.x += this.vx;
		this.y += this.vy;

		if (
			this.x < 0 ||
			this.x > field_w << 8 ||
			this.y < 0 ||
			this.y > field_h << 8
		) {
			this.kill = true;
		}
	}

	draw() {
		drawSprite(this.snum, this.x, this.y);
	}
}
