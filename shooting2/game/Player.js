'use strict';

class Player {
	constructor() {
		this.x = (field_w / 2) << 8;
		this.y = (field_h - 50) << 8;
		this.r = 5;
		this.damage = 0;
		this.speed = 1024; //256で１フレームに１ピクセル動く
		this.anime = 0;
		this.reload = 0;
		this.magazine = 0;
		this.stun = 0;
		this.count = 0;
		this.maxHp = 10;
		//自機HP
		this.hp = 10;

		//自機の攻撃力
		this.power = 1;

		//特殊攻撃のon off
		this.special = false;

		//特殊攻撃の効果時間
		this.specialTime = 0;

		//特殊攻撃の回数上限
		this.specialMagazine = 2;

		//特殊攻撃の持続時間 (15秒)
		this.specialMaxTime = 60 * 15;
	}

	//自機の移動
	update() {
		this.count++;

		if (this.specialTime) {
			this.specialTime--;
		} else {
			this.special = false;
		}

		if (key[70] && !this.special && this.specialMagazine) {
			//特殊攻撃（広範囲弾）は１５秒まで
			this.special = true;
			this.specialTime = this.specialMaxTime;
			this.specialMagazine--;
		}

		if (key[16]) {
			this.speed = 256;
		} else if (this.speed !== 1024) {
			this.speed = 1024;
		}

		if (this.damage) {
			this.damage--;
		}

		if (this.stun) {
			this.stun--;
		}
		if (key[32] && this.reload === 0) {
			bullet.push(new Bullet(this.x + (4 << 8), this.y, 0, -2000));
			bullet.push(new Bullet(this.x - (4 << 8), this.y, 0, -2000));

			if (this.special) {
				//斜めに発射
				bullet.push(new Bullet(this.x, this.y, 500, -2000));
				bullet.push(new Bullet(this.x, this.y, -500, -2000));

				bullet.push(new Bullet(this.x, this.y, 200, -2000));
				bullet.push(new Bullet(this.x, this.y, -200, -2000));
			}

			this.reload = 5; //60で約１秒間に一回発射できる
			this.magazine++;
			if (this.magazine >= 4) {
				this.reload = 20;
				this.magazine = 0;
			}
		}

		if (this.reload > 0) {
			this.reload--;
		}

		if (key[37]) {
			this.x -= this.speed;
			if (this.anime > -8) {
				this.anime--;
			}
		} else if (key[39]) {
			this.x += this.speed;

			if (this.anime < 8) {
				this.anime++;
			}
		} else {
			if (this.anime > 0) {
				this.anime--;
			}

			if (this.anime < 0) {
				this.anime++;
			}

			if (key[38]) {
				this.y -= this.speed;
			}

			if (key[40]) {
				this.y += this.speed;
			}
		}
		//範囲チェック
		if (this.x <= 1) {
			this.x = 20;
		}

		if (this.x >= field_w << 8) {
			this.x = (field_w << 8) - 1;
		}

		if (this.y < 0) {
			this.y = 0;
		}

		if (this.y >= (field_h << 8) - 1) {
			this.y = (field_h << 8) - 1;
		}
	}

	//描画
	draw() {
		if (this.stun && this.count & 1) {
			return;
		}
		drawSprite(2 + (this.anime >> 2), this.x, this.y);
		drawSprite(9 + (this.anime >> 2), this.x, this.y + (24 << 8));
		//(this.anime >> 2)は this.anime / 4 と同じだが、小数点が出ない
	}
}
