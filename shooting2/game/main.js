const info = true;
const debug = false;

//右クリックの回数を数える
let rightClick = 0;

const jumpUrl = [
	'https://student.hamako-ths.ed.jp/~ei2030/games/shooting/index.html',
	'https://student.hamako-ths.ed.jp/~ei2030/games/tetorisu/netarisu_ranking/main/index.html',
	'https://student.hamako-ths.ed.jp/~ei2030/games/tetorisu/speedUp_tetorisu/index.html',
];
//右クリック禁止
// document.oncontextmenu = () => {
// 	if (rightClick > 5) {
// 		console.log('The page is corrupted.');
// 		location.href = jumpUrl[rand(0, 2)];
// 	}
// 	rightClick++;
// 	return false;
// };

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
