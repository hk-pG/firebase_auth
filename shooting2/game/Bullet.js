'use strict';

class Bullet extends Character {
	constructor(x, y, vx, vy) {
		super(6, x, y, vx, vy);
		this.r = 4;
	}

	update() {
		super.update();

		for (let i = 0; i < enemy.length; i++) {
			if (!enemy[i].kill) {
				if (
					checkHit(this.x, this.y, this.r, enemy[i].x, enemy[i].y, enemy[i].r)
				) {
					//もし敵にあたっていたら、自機の弾を消す
					this.kill = true;

					//敵の hp を減らす
					enemy[i].hp -= player.power;

					//もし敵の hp が０以下ならば、死亡判定をする
					if (enemy[i].hp <= 0) {
						enemy[i].kill = true;
						scoreView += enemy[i].score;

						//スコアを加算していく
						//スコアをサーバに渡す処理

						//爆発エフェクト
						moreExplosion(
							enemy[i].x,
							enemy[i].y,
							enemy[i].vx >> 3,
							enemy[i].vy >> 3
						);
					} else {
						explosion.push(new Explosion(0, this.x, this.y, 0, 0));
					}

					if (enemy[i].maxHp >= 1000) {
						bossHp = enemy[i].hp;
						bossMhp = enemy[i].maxHp;
					}
					break;
				}
			}
		}
	}

	draw() {
		super.draw();
	}
}
