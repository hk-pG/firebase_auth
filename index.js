'use strict';

const ui = new firebaseui.auth.AuthUI(firebase.auth());

const uiConfig = {
	callbacks: {
		signInSuccessWithAuthResult: function (authResult, redirectUrl) {
			return true;
		},
	},
	signInFlow: 'popup',
	signInSuccessUrl: 'auth-sample01.html',
	signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
	toUrl: 'sample01.html',
	privacyUrl: 'auth-sample01.html',
};

ui.start('#firebase-ui-container', uiConfig);

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		const signOutMessage = `
        <p>Hello, ${user.displayName}</p>!
        <button type="submit" onClick="signOut()">サインアウト</button>
        `;
		document.getElementById('auth').innerHTML = signOutMessage;
		console.log('ログインしています');
	}
});

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
