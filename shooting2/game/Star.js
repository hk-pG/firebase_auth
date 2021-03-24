"use strict";

class Star {
	constructor() {
		this.x = rand(0, field_w) << 8;
		this.y = rand(0, field_h) << 8;
		this.vx = 0;
		this.vy = rand(30, 200);
		this.sz = rand(1, 2);
	}

	draw() {
		let x = this.x >> 8;
		let y = this.y >> 8;
		if (
			x < camera_x ||
			x >= camera_x + screen_w ||
			y < camera_y ||
			y >= camera_y + screen_h
		)
			return;
		vctx.fillStyle = rand(0, 2) !== 0 ? "#66f" : "#aef";
		vctx.fillRect(this.x >> 8, this.y >> 8, this.sz, this.sz);
	}

	update() {
		//星の速度の倍率
		let starSpeedPercentage = starSpeed / 100;
		this.x += this.vx * starSpeedPercentage;
		this.y += this.vy * starSpeedPercentage;
		if (this.y > field_h << 8) {
			this.y = 0;
			this.x = rand(0, field_w) << 8;
		}
	}
}
