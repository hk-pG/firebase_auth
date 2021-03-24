//敵の弾発射
const enemyBullet = (object, speed) => {
	let angle, vx, vy;

	//敵キャラからプレイヤーへの角度
	angle = Math.atan2(player.y - object.y, player.x - object.x);

	angle += (rand(-10, 10) * Math.PI) / 180;

	vx = Math.cos(angle) * speed;
	vy = Math.sin(angle) * speed;

	enemyShot.push(new EnemyShot(15, object.x, object.y, vx, vy));
};

//ピンクのヒヨコの行動パターン ####################################################
const enemyMovePink = (object) => {
	if (!object.flag) {
		if (player.x > object.x && object.vx < 120) {
			object.vx += 4;
		} else if (object.vx > -120) {
			object.vx -= 4;
		}
	} else {
		if (player.x < object.x && object.vx < 400) {
			object.vy -= 30;
		} else if (object.vx > -400) {
			object.vx -= 30;
		}
	}

	if (Math.abs(player.y - object.y) < 100 << 8 && !object.flag) {
		object.flag = true;
		enemyBullet(object, 1000);
	}

	if (object.flag && object.vy > -500) {
		object.vy -= 30;
	}

	//スプライトの変更
	//スプライトのパターン（アニメーションを表現）
	const ptn = [39, 40, 39, 41];
	object.snum = ptn[(object.count >> 3) & 3];
};

//黄色のヒヨコの行動パターン ####################################################
const enemyMoveYellow = (object) => {
	if (!object.flag) {
		if (player.x > object.x && object.vx < 300) {
			object.vx += 30;
		} else if (object.vx > -600) {
			object.vx -= 30;
		}
	} else {
		if (player.x < object.x && object.vx < 300) {
			object.vy += 30;
		} else if (object.vx > -600) {
			object.vx += 50;
		}
	}

	if (!object.flag) {
		//連射率を操作
		if (rand(0, 4) === 1) {
			object.flag = true;
		}
		enemyBullet(object, 1000);
	}

	const ptn = [33, 34, 33, 35];
	object.snum = ptn[(object.count >> 3) & 3];
};

//ボスヒヨコ(黄色)の行動パターン ##################################################
const enemyMoveBoss = (object) => {
	if (!object.flag && object.y >> 8 >= 120) {
		object.flag = 1;
	}

	if (object.flag === 1) {
		object.vy -= 1;
		if (object.vy <= 0) {
			object.flag = 2;
			object.vy = 0;
		}
	} else if (object.flag === 2) {
		if (object.vx < 300) {
			object.vx += rand(1, 300);
		}

		if (object.x >> 8 > field_w - 100) {
			object.flag = 3;
		}
	} else if (object.flag === 3) {
		if (object.vx > -300) {
			object.vx -= rand(1, 300);
		}

		if (object.x >> 8 < 100) {
			object.flag = 2;
		}
	}

	//弾の発射
	if (object.flag > 1) {
		let angle, vx, vy, bossR;
		bossR = 70;
		//敵キャラから目標への角度
		angle = (object.direction * Math.PI) / 180;

		vx = Math.cos(angle) * 300;
		vy = Math.sin(angle) * 300;
		let xGap = (Math.cos(angle) * bossR) << 8;
		let yGap = (Math.sin(angle) * bossR) << 8;
		enemyShot.push(
			new EnemyShot(15, object.x + xGap, object.y + yGap, vx, vy, 30)
		);
		object.direction += object.directionGap;

		if (object.direction >= 360) {
			object.direction = 0;
			if (rand(0, 2) === 0) {
				//360度周期　＆　３分の１の確率で弾の角度を変える
				object.directionGap = rand(3.5, 60);
			}
		}
	}

	if (object.hp < object.maxHp / 2) {
		let count = object.count % (60 * 5);
		if (count / 10 < 4 && count % 10 === 0) {
			//雑魚キャラを出現
			let angle, vx, vy, bossR;
			bossR = 70;
			//敵キャラから目標への角度
			angle = 90 + 45 - ((count / 10) * 30 * Math.PI) / 180;

			vx = Math.cos(angle) * 300;
			vy = Math.sin(angle) * 300;
			let xGap = (Math.cos(angle) * bossR) << 8;
			let yGap = (Math.sin(angle) * bossR) << 8;
			enemy.push(new Enemy(3, object.x + xGap, object.y + yGap, vx, vy));
		}
	}

	//スプライトの変更
	object.snum = 75;
};

//ボスヒヨコ（黄色）の子供
const enemyMoveYellowChild = (object) => {
	//出現直後は一瞬動かない
	if (object.count === 10) {
		object.vx = 0;
		object.vy = 0;
	} else if (object.count >= 60) {
		//１秒後、自機を避けて動き始める
		if (object.x > player.x) {
			object.vx -= 5;
		} else {
			object.vx += 5;
		}
		object.vy = 1;

		//更に少し経ったら弾を発射してくる
		if (object.count >= 100) {
			if (!object.reload) {
				enemyBullet(object, 300);
				object.reload = 200;
			}
		}
	}

	const ptn = [50, 52, 50, 53];
	object.snum = ptn[(object.count >> 3) & 3];
};
