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
		docUser
			.get()
			.then((doc) => {
				if (doc.exists) {
					//既にアカウントが存在する
					const loginText_inner = `ようこそ、${doc.data().name}`;
					document.getElementById('login-text').innerHTML = loginText_inner;

					console.log(doc.data());
					console.log('ログインしています');
					console.log(`score : ${score}`);
				} else {
					//アカウントのデータが存在しない
					console.log('初ログイン');
					console.log(`userID : ${user.uid} = userName : ${user.displayName}`);

					//スコアを投稿する際に名前をセットする。
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
