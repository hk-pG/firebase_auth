'use strict';

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

const signOut = () => {
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
};

const isLogin = document.getElementById('isLogin');
auth.onAuthStateChanged((user) => {
	if (user) {
		//ログインしている時
		document.getElementById('isLogout').style.display = 'none';
		isLogin.style.display = 'flex';
		const docUser = db.collection('profiles').doc(`${auth.currentUser.uid}`);
		const inputUserName = document.getElementById('userName');
		const scoreSubmit = document.getElementById('score-submit');

		docUser
			.get()
			.then((doc) => {
				if (doc.exists) {
					//既にアカウントが存在する
					const loginText_inner = `ようこそ、${doc.data().name}さん`;
					document.getElementById('login-text').innerHTML = loginText_inner;

					console.log('ログインしています');
					console.log(
						`データの取得に成功しました：${doc.data().name}-${doc.data().score}`
					);

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
									},
									{ merge: true }
								)
								.then(() => {
									console.log('データの書き換えに成功しました');
								})
								.catch((err) => {
									console.error('データの書き換え失敗しました', err);
								});
						} else {
							console.log('書き換えを行いませんでした');
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
									console.log('データの書き換えに成功しました');
								})
								.catch((err) => {
									console.error('データの書き換え失敗しました', err);
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
								console.log('success');
							})
							.catch((error) => {
								console.error('エラーだお', error);
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
