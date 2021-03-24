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

		let angle, vx, vy;

		//敵キャラからプレイヤーへの角度
		angle = Math.atan2(player.y - object.y, player.x - object.x);

		angle += (rand(-10, 10) * Math.PI) / 180;

		vx = Math.cos(angle) * 100;
		vy = Math.sin(angle) * 100;

		enemyShot.push(new EnemyShot(15, object.x, object.y, vx, vy));
	}

	if (object.flag && object.vy > -800) {
		object.vy -= 30;
	}
};
