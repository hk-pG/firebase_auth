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

auth.onAuthStateChanged((user) => {
	if (user) {
		//ログインしている時
		document.getElementById('isLogout').style.display = 'none';
		const docUser = db.collection('profiles').doc(`${auth.currentUser.uid}`);
		docUser
			.get()
			.then((doc) => {
				if (doc.exists) {
					console.log(doc.data());
					const signOutButton = `
                <p class="login-text"> ようこそ、${doc.data().name} </p>
                <button type="submit" onClick="signOut()">サインアウト</button>
                `;
					document.getElementById('isLogin').innerHTML = signOutButton;
					console.log('ログインしています');
				} else {
					console.log('error');
				}
			})
			.catch((error) => {
				console.log('エラーだお', error);
			});
	} else {
		//ログアウトしている時
		document.getElementById('isLogin').style.display = 'none';
		ui.start('#firebase-ui-container', uiConfig);
	}
});
