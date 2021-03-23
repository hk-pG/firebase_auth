'use strict';

const ui = new firebaseui.auth.AuthUI(firebase.auth());
const auth = firebase.auth();
const db = firebase.firestore();

const uiConfig = {
	callbacks: {
		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
			return true;
		},
	},
	signInFlow: 'popup',
	signInSuccessUrl: 'index.html',
	signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
	toUrl: 'index.html',
	privacyUrl: 'index.html',
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
const loginUI = document.getElementById('firebase-ui-container');

ui.start('#firebase-ui-container', uiConfig);

auth.onAuthStateChanged((user) => {
	if (user) {
		//ログイン時の処理
		const signOutMessage = `
        <p class="login-text">Hello, ${user.displayName}!</p>
        <button type="submit" onClick="signOut()">サインアウト</button>
        `;
		document.getElementById('auth').innerHTML = signOutMessage;
		console.log('ログインしています');
		loginUI.style.display = 'none';

		db.collection('profiles')
			.doc(`${auth.currentUser.uid}`)
			.set({
				name: '名前（仮）',
				score: 3,
			})
			.then(() => {
				console.log('success');
			})
			.catch((error) => {
				console.error('エラーだお', error);
			});
	}
});
