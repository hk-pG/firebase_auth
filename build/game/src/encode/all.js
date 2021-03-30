'use strict';

//キーボードが押された時
document.onkeydown = (e) => {
	key[e.keyCode] = true;

	if ((gameOver || gameClear) && e.keyCode === 82 /* R */ && inputOnFocus) {
		document.location.reload();
	}

	if (
		e.keyCode !== 17 && //Ctrl
		e.keyCode !== 82 && //R
		e.keyCode !== 70 && //F
		!(gameOver || gameClear)
	) {
		e.preventDefault();
	}
};

//認証画面の表示
const finishGame = () => {
	afterGame.classList.remove('playing');
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
		finishGame();
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
		ctx.font = '15px Verdana';
		ctx.fillText(`SCORE : ${score}`, 10, screen_h - 40);
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
//スプライトの情報(画像の切り取り)
class Sprite {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}
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
					if (enemy[i].hp <= 0 && !(gameClear || gameOver)) {
						enemy[i].kill = true;
						score += enemy[i].score;

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
		this.direction = 90; //右側が０度なので、下方向は９０度となる
		this.directionGap = 10;

		//リロード時間
		this.reload = 0;
	}

	update() {
		super.update();

		if (this.reload) {
			this.reload--;
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

let enemyFunctions = [
	enemyMovePink,
	enemyMoveYellow,
	enemyMoveBoss,
	enemyMoveYellowChild,
];
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
			if (!(gameOver || gameClear)) {
				isAttacked(this);
			}
		}

		this.snum = 14 + ((this.count >> 3) & 1);
	}
}
class EnemyMaster {
	constructor(eNum, r, hp, score) {
		this.eNum = eNum;
		this.r = r;
		this.hp = hp;
		this.score = score;
	}
} //スプライト
let sprite = [
	new Sprite(0, 0, 22, 42), //0　自機　左２
	new Sprite(23, 0, 33, 42), //1　自機　左１
	new Sprite(57, 0, 43, 42), //2　自機　正面
	new Sprite(101, 0, 33, 42), //3　自機　右１
	new Sprite(135, 0, 21, 42), //4　自機　右２
	new Sprite(0, 50, 3, 7), //5　銃弾　１
	new Sprite(4, 50, 5, 5), //6　銃弾　２

	new Sprite(3, 42, 16, 5), // 7,噴射 左2
	new Sprite(29, 42, 21, 5), // 8,噴射 左1
	new Sprite(69, 42, 19, 5), // 9,噴射 正面
	new Sprite(108, 42, 21, 5), //10,噴射 右1
	new Sprite(138, 42, 16, 5), //11,噴射 右2

	new Sprite(11, 50, 7, 7), //12,敵弾1-1
	new Sprite(19, 50, 7, 7), //13,敵弾1-2
	new Sprite(32, 49, 8, 8), //14,敵弾2-1
	new Sprite(42, 47, 12, 12), //15,敵弾2-2

	new Sprite(5, 351, 9, 9), //16  ,爆発1
	new Sprite(21, 346, 20, 20), //17  ,爆発2
	new Sprite(46, 343, 29, 27), //18  ,爆発3
	new Sprite(80, 343, 33, 30), //19  ,爆発4
	new Sprite(117, 340, 36, 33), //20  ,爆発5
	new Sprite(153, 340, 37, 33), //21  ,爆発6
	new Sprite(191, 341, 25, 31), //22  ,爆発7
	new Sprite(216, 349, 19, 16), //23  ,爆発8
	new Sprite(241, 350, 15, 14), //24  ,爆発9
	new Sprite(259, 350, 14, 13), //25  ,爆発10
	new Sprite(276, 351, 13, 12), //26  ,爆発11

	new Sprite(6, 373, 9, 9), //27  ,ヒット1
	new Sprite(19, 371, 16, 15), //28  ,ヒット2
	new Sprite(38, 373, 11, 12), //29  ,ヒット3
	new Sprite(54, 372, 17, 17), //30  ,ヒット4
	new Sprite(75, 374, 13, 14), //31  ,ヒット5

	new Sprite(4, 62, 24, 27), //32  ,黄色1
	new Sprite(36, 62, 24, 27), //33  ,黄色2
	new Sprite(68, 62, 24, 27), //34  ,黄色3
	new Sprite(100, 62, 24, 27), //35  ,黄色4
	new Sprite(133, 62, 24, 27), //36  ,黄色5
	new Sprite(161, 62, 30, 27), //37  ,黄色6

	new Sprite(4, 95, 24, 26), //38  ,ピンク1
	new Sprite(36, 95, 24, 26), //39  ,ピンク2
	new Sprite(68, 95, 24, 26), //40  ,ピンク3
	new Sprite(100, 95, 24, 26), //41  ,ピンク4
	new Sprite(133, 92, 24, 29), //42  ,ピンク5
	new Sprite(161, 95, 30, 26), //43  ,ピンク6

	new Sprite(4, 125, 24, 29), //44  ,青グラサン1
	new Sprite(36, 125, 24, 29), //45  ,青グラサン2
	new Sprite(68, 125, 24, 29), //46  ,青グラサン3
	new Sprite(100, 125, 24, 29), //47  ,青グラサン4
	new Sprite(133, 124, 24, 30), //48  ,青グラサン5
	new Sprite(161, 125, 30, 29), //49  ,青グラサン6

	new Sprite(4, 160, 25, 27), //50  ,ロボ1
	new Sprite(34, 160, 26, 27), //51  ,ロボ2
	new Sprite(66, 160, 26, 27), //52  ,ロボ3
	new Sprite(98, 160, 26, 27), //53  ,ロボ4
	new Sprite(132, 160, 26, 27), //54  ,ロボ5
	new Sprite(161, 158, 30, 29), //55  ,ロボ6

	new Sprite(4, 194, 24, 28), //56  ,にわとり1
	new Sprite(36, 194, 24, 28), //57  ,にわとり2
	new Sprite(68, 194, 24, 28), //58  ,にわとり3
	new Sprite(100, 194, 24, 28), //59  ,にわとり4
	new Sprite(133, 194, 24, 30), //60  ,にわとり5
	new Sprite(161, 194, 30, 28), //61  ,にわとり6

	new Sprite(4, 230, 22, 26), //62  ,たまご1
	new Sprite(41, 230, 22, 26), //63  ,たまご2
	new Sprite(73, 230, 22, 26), //64  ,たまご3
	new Sprite(105, 230, 22, 26), //65  ,たまご4
	new Sprite(137, 230, 22, 26), //66  ,たまご5

	new Sprite(6, 261, 24, 28), //67  ,殻帽ヒヨコ1
	new Sprite(38, 261, 24, 28), //68  ,殻帽ヒヨコ2
	new Sprite(70, 261, 24, 28), //69  ,殻帽ヒヨコ3
	new Sprite(102, 261, 24, 28), //70  ,殻帽ヒヨコ4
	new Sprite(135, 261, 24, 28), //71  ,殻帽ヒヨコ5

	new Sprite(206, 58, 69, 73), //72  ,黄色(中)
	new Sprite(204, 134, 69, 73), //73  ,ピンク(中)
	new Sprite(205, 212, 69, 78), //74  ,青グラサン(中)

	new Sprite(337, 0, 139, 147), //75  ,黄色(大)
	new Sprite(336, 151, 139, 147), //76  ,ピンク(大)
	new Sprite(336, 301, 139, 155), //77  ,青グラサン()
];
const info = true;
const debug = false;

//名前の入力欄
const scoreSubmit = document.getElementById('score-submit');

//入力欄にフォーカスがあるときは、Rでのリロードをキャンセルする
let inputOnFocus = true;

scoreSubmit.addEventListener('click', () => {
	inputOnFocus = false;
});

scoreSubmit.addEventListener('focusout', () => {
	inputOnFocus = true;
});

//認証画面の表示をゲームの終了後のみにする
const afterGame = document.getElementById('after-game');
afterGame.classList.add('playing');

//右クリックの回数を数える
let rightClick = 0;

const jumpUrl = [
	'https://student.hamako-ths.ed.jp/~ei2030/games/shooting/index.html',
	'https://student.hamako-ths.ed.jp/~ei2030/games/tetorisu/netarisu_ranking/main/index.html',
	'https://student.hamako-ths.ed.jp/~ei2030/games/tetorisu/speedUp_tetorisu/index.html',
];
//右クリック禁止
document.oncontextmenu = () => {
	if (rightClick > 5) {
		console.log('The page is corrupted.');
		location.href = jumpUrl[rand(0, 2)];
	}
	rightClick++;
	return false;
};

if (debug) {
	console.log('ready OK');
}
//スムージング
const SMOOOTHING = false;

let drawCount = 0;
let fps = 0;
let lastTime = Date.now();
//画面サイズ
const screen_w = 360;
const screen_h = 500;

//キャンバスのサイズ
const canvas_w = screen_w * 2;
const canvas_h = screen_h * 2;

//フィールドのサイズ
const field_w = screen_w + 120;
const field_h = screen_h + 120;

//キャンバス
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas_w;
canvas.height = canvas_h;

//画像の引き伸ばし（ぼやけ）を回避
ctx.mozimageSmoothingEnabled = SMOOOTHING;
ctx.webkitSmoothingEnabled = SMOOOTHING;
ctx.msimageSmoothingEnabled = SMOOOTHING;
ctx.msimageSmoothingEnabled = SMOOOTHING;

//フィールド（仮想画面）
const vcanvas = document.createElement('canvas');
const vctx = vcanvas.getContext('2d');
vcanvas.width = canvas_w;
vcanvas.height = canvas_h;

//カメラの座標
let camera_x = 0;
let camera_y = 0;

//星の数
const star_max = 300;

//ファイルの読み込み
let spriteImage = new Image();
spriteImage.src = 'sprites/sprite.png';

//星の実体
let star = [];

//キーボードの状態
let key = [];

//銃弾
let bullet = [];

//敵キャラの種類
let enemyMaster = [
	new EnemyMaster(0, 10, 1, 100), //ピンクのヒヨコ
	new EnemyMaster(1, 10, 1, 100), //黄色のヒヨコ
	new EnemyMaster(2, 70, 1000, 10000), //ボスヒヨコ（黄色）
	new EnemyMaster(3, 15, 5, 10), //ボスヒヨコ（黄色）の子供
];

//敵キャラ
let enemy = [];

//ボスの体力の最大値
let bossMhp = 0;
let bossHp = 0;
//敵キャラの割合
let enemyRate = [0, 1];

//敵の攻撃
let enemyShot = [];

//ボスの出現フラグ
let bossEncount = false;

//自機の情報
let player = new Player();

//爆発の情報
let explosion = [];

//ゲームスピード
const gameSpeed = 1000 / 60;

//ゲームクリアフラグ
let gameClear = false;

//ゲームオーバーフラグ
let gameOver = false;

//ゲーム全体の経過フレーム
let gameTimer = 0;

//ゲームのカウント（経過フレームをウェイブ毎に持つ）
let gameCount = 0;

//ゲームのウェイブ（段階）
let gameWave = 0;

//ゲームのラウンド数（周回の数）
let gameRound = 0;

//スコア
let score = 0;

//背景の星の速度
let starSpeed = 100;

//要求する星の速度
let starRequest = 100;

//ゲームの初期化
const gameInit = () => {
	//Starクラスのインスタンスを作成
	for (let i = 0; i < star_max; i++) {
		star[i] = new Star();
		star[i].draw();
	}

	//ゲームループ
	const gameLoop = () => {
		if (!(gameClear || gameOver)) {
			gameTimer++;
			gameCount++;

			//段階に分けて、要求する速度を上げて行く（段々速くなる）
			if (starRequest > starSpeed) {
				starSpeed++;
			} else if (starRequest < starSpeed) {
				starRequest--;
			}

			//敵を出現
			if (gameWave === 0) {
				if (rand(0, 30) === 1) {
					enemy.push(
						new Enemy(
							//ピンクのヒヨコだけを出す
							0,
							rand(0, field_w) << 8,
							0,
							0,
							rand(300, 1200)
						)
					);
				}

				if (gameCount > 60 * 30) {
					//２０秒経過したらウェーブを１段階上げる
					gameWave++;
					gameCount = 0;
					starSpeed = 200;
				}
			} else if (gameWave === 1) {
				if (rand(0, 30) === 1) {
					enemy.push(
						new Enemy(
							// enemyRate[rand(0, 1)],
							//黄色のヒヨコだけを出す
							1,
							rand(0, field_w) << 8,
							0,
							0,
							rand(300, 1200)
						)
					);
				}

				if (gameCount > 60 * 20) {
					//２０秒経過したらウェーブを１段階上げる
					gameWave++;
					gameCount = 0;
					starSpeed = 300;
				}
			} else if (gameWave === 2) {
				if (rand(0, 20) === 1) {
					enemy.push(
						new Enemy(rand(0, 1), rand(0, field_w) << 8, 0, 0, rand(300, 1200))
					);
				}

				if (gameCount > 60 * 30) {
					//30秒経過したらウェーブを１段階上げる
					gameWave++;
					gameCount = 0;
					starSpeed = 600;
				}
			} else if (gameWave === 3) {
				gameCount++;

				// ボスキャラ出現
				if (gameCount === 60 * 5) {
					enemy.push(new Enemy(2, (field_w / 2) << 8, 0, 0, 200));
					bossEncount = true;
				}

				//敵がいなくなったらループ or ゲームクリア <
				if (enemy.length === 0 && gameCount > 60 * 6) {
					//8秒程度経過したらゲームクリアを表示する
					setTimeout(() => {
						gameClear = true;
						finishGame();
					}, 8000);
				}
			}
		}

		updateAll();
		drawAll();
		information();
	};

	//ゲームループ呼び出し
	setInterval(gameLoop, gameSpeed);
};

//オンロード時にゲームを開始
window.onload = function () {
	//alertは「OK」が押されるまで、次の処理を待機できる。
	// alert('矢印キーで移動、');
	// alert('スペースで射撃だ！');
	// alert('SHIFTキーで減速できるぞ！');
	// alert('Fキーを押すと...?');
	// alert('始まるぞ！！！');
	gameInit();
};
const auth = firebase.auth();
const ui = new firebaseui.auth.AuthUI(auth);
const db = firebase.firestore();

const uiConfig = {
	callback: {
		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
			return true;
		},
	},
	signInFlow: 'popup',
	signInSuccess: 'index.html',
	signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
	// toUrl: 'index.html',
	// privacyUrl: 'index.html',
};

function signOut() {
	firebase.auth().onAuthStateChanged((user) => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log('ログアウトしました');
				location.reload();
			})
			.catch((error) => {
				console.log(`ログアウト時にエラーが発生しました (${error})`);
			});
	});
}

const isLogin = document.getElementById('isLogin');
auth.onAuthStateChanged((user) => {
	if (user) {
		//ログインしている時
		document.getElementById('isLogout').style.display = 'none';
		isLogin.style.display = 'flex';
		const docUser = db.collection('profiles').doc(`${auth.currentUser.uid}`);
		const inputUserName = document.getElementById('userName');
		const loginText = document.getElementById('login-text');

		docUser
			.get()
			.then((doc) => {
				if (doc.exists) {
					//既にアカウントが存在する
					const loginText_inner = `ようこそ、${doc.data().name}さん`;
					loginText.innerHTML = loginText_inner;

					console.log('ログインしています');
					console.log('データの取得に成功しました');
					console.log(doc.data());

					//既存のユーザ名を取得する
					let oldUserName;
					let oldScore;
					docUser
						.get()
						.then((doc) => {
							if (doc.exists) {
								oldUserName = doc.data().name;
								oldScore = doc.data().score;
								inputUserName.value = oldUserName;
							} else {
								oldUserName = undefined;
								oldScore = 0;
								inputUserName.value = '';
							}
						})
						.catch((err) => {
							console.error('エラーだお', err);
							oldUserName = undefined;
							oldScore = 0;
							inputUserName.value = '';
						});

					//スコアの投稿処理
					scoreSubmit.addEventListener('submit', () => {
						if (score > oldScore) {
							docUser
								.set(
									{
										score: score,
										life: player.hp,
									},
									{ merge: true }
								)
								.then(() => {
									alert('スコアを投稿しました');
									inputUserName.value = '';
								})
								.catch((err) => {
									console.error('データの書き換え失敗しました', err);
								});
						} else {
							alert('通信に成功しました');
							console.log('スコアの書き換えを行いませんでした');
						}

						if (oldUserName !== inputUserName.value) {
							docUser
								.set(
									{
										name: inputUserName.value,
									},
									{ merge: true }
								)
								.then(() => {
									alert('スコアを投稿しました');
									const loginText_inner = `ようこそ、${inputUserName.value}さん`;
									inputUserName.value = '';
									loginText.innerHTML = loginText_inner;
								})
								.catch((err) => {
									alert('データの送信に失敗しました');
									console.error('エラー', err);
								});
						}
					});
				} else {
					//アカウントのデータが存在しない
					console.log('初ログイン');
					console.log(`userID : ${user.uid} = userName : ${user.displayName}`);

					//スコアを投稿する際に名前をセットする。
					scoreSubmit.addEventListener('submit', () => {
						db.collection('profiles')
							.doc(user.uid)
							.set({
								name: document.getElementById('userName').value,
								score: score,
							})
							.then(() => {
								alert('スコアを投稿しました');
								inputUserName.value = '';
							})
							.catch((err) => {
								alert('データの送信に失敗しました');
								console.error('エラー', err);
							});
					});
				}
			})
			.catch((error) => {
				console.log('エラーだお', error);
			});
	} else {
		//ログアウトしている時
		isLogin.style.display = 'none';
		ui.start('#firebase-ui-container', uiConfig);

		console.log(`score : ${score}`);
	}
});
