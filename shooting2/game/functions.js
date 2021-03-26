'use strict';

//キーボードが押された時
document.onkeydown = (e) => {
	key[e.keyCode] = true;

	if (gameOver && e.keyCode === 82) {
		document.location.reload();
	}

	if (e.keyCode !== 17 && e.keyCode !== 82 && e.keyCode !== 70) {
		// e.preventDefault();
	}
};

//キーボードが離された時
document.onkeyup = (e) => {
	key[e.keyCode] = false;
};

//ランダムな値を返す
const rand = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

//スプライトを描画する
const drawSprite = (snum, x, y) => {
	let sx = sprite[snum].x;
	let sy = sprite[snum].y;
	let sw = sprite[snum].w;
	let sh = sprite[snum].h;

	let px = (x >> 8) - sw / 2;
	let py = (y >> 8) - sh / 2;
	if (
		px + sw < camera_x ||
		px >= camera_x + screen_w ||
		py + sh < camera_y ||
		py >= camera_y + screen_h
	)
		return;

	vctx.drawImage(spriteImage, sx, sy, sw, sh, px, py, sw, sh);
};

//オブジェクトをアップデート
const updateObject = (object) => {
	for (let i = object.length - 1; i >= 0; i--) {
		object[i].update();
		if (object[i].kill) {
			object.splice(i, 1);
		}
	}
};

//オブジェクトを描画
const drawObject = (object) => {
	for (let i = 0; i < object.length; i++) {
		object[i].draw();
	}
};

const checkHit = (px, py, pr, ex, ey, er) => {
	//円同士の当たり判定

	//底辺
	let a = (px - ex) >> 8;
	//高さ
	let b = (py - ey) >> 8;
	//半径足す半径
	let r = pr + er;

	if (r * r >= a * a + b * b) {
		return true;
	}

	/*
	矩形同士の当たり判定
	let pLeft = px >> 8;
	let pRight = pLeft + pw;
	let pTop = py >> 8;
	let pBottom = pTop + ph;

	let eLeft = ex >> 8;
	let eRight = eLeft + ew;
	let eTop = ey >> 8;
	let eBottom = eTop + eh;

	if (
		pLeft <= eRight &&
		pRight >= eLeft &&
		pTop <= eBottom &&
		pBottom >= eTop
	) {
		return true;
	} else {
		return false;
	}
	*/
};

//派手な爆発
const moreExplosion = (x, y, vx, vy) => {
	explosion.push(new Explosion(0, x, y, vx, vy));
	for (let i = 0; i < 10; i++) {
		let evx = vx + (rand(-10, 10) >> 8);
		let evy = vy + (rand(-10, 10) >> 8);
		explosion.push(new Explosion(i, x, y, evx, evy));
	}
};

const isAttacked = (object) => {
	player.hp -= 1;
	if (player.hp < 0) {
		gameOver = true;
	} else {
		object.hp--;
		if (object.hp < 0) {
			object.kill = true;
		}
		player.damage = 10;
		player.stun = 60;
	}
};

//******************************** 移動の処理 ********************************
const updateAll = () => {
	updateObject(star);
	updateObject(bullet);
	updateObject(enemyShot);
	updateObject(enemy);
	updateObject(explosion);

	//自機の移動
	player.update();
};

//******************************** 描画の処理 ********************************
const drawAll = () => {
	//呼び出す度にフィールドを黒く塗りつぶす = フィールドをクリアする
	vctx.fillStyle = player.damage ? 'red' : 'black';
	vctx.fillRect(camera_x - 10, camera_y - 10, field_w, field_h);

	drawObject(star);

	//ゲームオーバー時に表示を消す
	if (!gameOver && !gameClear) {
		drawObject(explosion);
		drawObject(enemyShot);
		drawObject(bullet);
		player.draw();
	}
	drawObject(enemy);

	//　自機の範囲  0 ~ field_w
	//カメラの範囲  0 ~ (field_w - screen_w)
	camera_x = ((player.x >> 8) / field_w) * (field_w - screen_w);
	camera_y = ((player.y >> 8) / field_h) * (field_h - screen_h);

	//ボスのHPを表示
	if (bossHp > 0) {
		//HPバーのサイズ
		let size = ((screen_w - 20) * bossHp) / bossMhp;
		let maxSize = screen_w - 20;

		//残りHPを表示
		vctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
		vctx.fillRect(camera_x + 10, camera_y + 10, size, 10);

		//バーの枠を表示
		vctx.strokeStyle = 'yellow';
		vctx.strokeRect(camera_x + 10, camera_y + 10, size, 10);

		//最大HPを示す枠
		vctx.strokeRect(camera_x + 10, camera_y + 10, maxSize, 10);
	}

	//仮想画面から実際の画面にコピー
	ctx.drawImage(
		vcanvas,
		camera_x,
		camera_y,
		screen_w,
		screen_h,
		0,
		0,
		screen_w,
		screen_h
	);
};

//当たり判定

//##############################	ゲームの情報を表示	 ##############################
const information = () => {
	ctx.font = '15px Impact';
	ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
	if (gameOver) {
		ctx.font = '30px Verdana';
		ctx.fillStyle = 'red';
		let message1 = 'GAME OVER';
		let message2 = "push 'R' to one more!";
		let x = canvas_w / 8;
		let y = canvas_h / 4;
		ctx.fillText(message1, x, y);
		x -= 70;
		y += 40;
		ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
		ctx.fillText(message2, x, y);
	} else if (gameClear) {
		//ゲームクリア時のメッセージ
		ctx.font = '30px Verdana';
		ctx.fillStyle = 'Yellow';
		let message1 = 'GAME CLEAR';
		let x = canvas_w / 8;
		let y = canvas_h / 4;

		ctx.fillText(message1, x, y);
		ctx.font = '15px Verdana';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
		y += 30;
		let time = (gameTimer / 60).toFixed(2);
		ctx.fillText(`TIME  : ${time} s`, x, y);
		ctx.fillText(`SCORE : ${score}`, x, y + 20);
		ctx.fillText(`HP  : ${player.hp}`, x, y + 40);
	} else {
		drawCount++;
		if (lastTime + 1000 <= Date.now()) {
			fps = drawCount;
			drawCount = 0;
			lastTime = Date.now();
		}

		ctx.fillText(`HP : ${player.hp}`, 10, screen_h - 20);
		ctx.fillText(`SCORE : ${score}`, 10, screen_h - 40);

		//右下にタイマーを表示
		let time = (gameTimer / 60).toFixed(2);
		ctx.fillText(`TIME : ${time}`, screen_w - 90, screen_h - 20);

		//タイマーの上にラウンド数を表示
		// ctx.fillText(`Round : ${gameRound}`, screen_w - 86, screen_h - 40);

		if (player.special) {
			//特殊攻撃の残り時間バーのサイズ
			let size = ((screen_w / 4) * player.specialTime) / player.specialMaxTime;
			let maxSize = screen_w / 4;

			//残り時間を表示
			ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
			ctx.fillRect(10, screen_h - 70, size, 10);

			ctx.strokeStyle = 'lime';
			ctx.strokeRect(10, screen_h - 70, maxSize, 10);
		} else if (!player.special) {
			ctx.fillText(`SPECIAL : ${player.specialMagazine}`, 10, screen_h - 60);
		}
	}
};

//試作関数 ###########################################################################

//画面内のランダムな位置に座標をテレポートする
const teleport = (object) => {
	//最大値は、ビットシフトにより最適化する必要がある & 少し範囲を狭めて安全性を高める
	object.x = rand(0, (field_w << 8) - 100);
	object.y = rand(0, (field_h << 8) - 100);

	//テレポート先の座標を確認
	// console.log(`moved x : ${object.x >> 8}, y: ${object.y >> 8}`);
};

//画面内の指定範囲内のランダムな位置に座標をテレポートする
const teleportCustom = (object, min_x, min_y) => {
	object.x = rand(min_x, (field_w << 8) - min_x);
	object.y = rand(min_y, (field_w << 8) - min_y);

	//テレポート先の座標を確認
	// console.log(`moved x : ${object.x >> 8}, y: ${object.y >> 8}`);
};
