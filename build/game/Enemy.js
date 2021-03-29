"use strict";

class Enemy extends Character {
	constructor(enemy, x, y, vx, vy) {
		super(0, x, y, vx, vy);
		this.eNum = enemyMaster[enemy].eNum;
		this.r = enemyMaster[enemy].r;
		this.maxHp = enemyMaster[enemy].hp;
		this.hp = this.maxHp;
		this.score = enemyMaster[enemy].score;
		this.flag = false;

		//弾の発射角度
		this.direction = 90;//右側が０度なので、下方向は９０度となる
        this.directionGap = 10;

        //リロード時間
		this.reload = 0;
	}

	update() {
		super.update();

		if (this.reload) {
			this.reload --;
		}

		//個別のアップデート
		enemyFunctions[this.eNum](this);

		//当たり判定
		if (
			!player.stun &&
			checkHit(this.x, this.y, this.r, player.x, player.y, player.r)
		) {
			isAttacked(this);
		}
	}
}

let enemyFunctions = [enemyMovePink, enemyMoveYellow, enemyMoveBoss, enemyMoveYellowChild];
