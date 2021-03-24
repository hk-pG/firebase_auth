'use strict';

class EnemyShot extends Character {
	constructor(snum, x, y, vx, vy, timer) {
		super(snum, x, y, vx, vy);
		this.r = 4;
		if (timer === undefined) {
			this.timer = 0;
		} else {
			this.timer = timer;
		}
	}
	update() {
		if (this.timer) {
			this.timer--;
			return;
		}
		super.update();
		if (
			!player.stun &&
			checkHit(this.x, this.y, this.r, player.x, player.y, player.r)
		) {
			if (!gameClear) {
				isAttacked(this);
			}
		}

		this.snum = 14 + ((this.count >> 3) & 1);
	}
}
