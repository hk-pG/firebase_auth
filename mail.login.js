const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');
const inputUserName = document.getElementById('inputUserName');

const submit = document.getElementById('submit');

submit.addEventListener('click', () => {
	const email = inputEmail.value;
	const password = inputPassword.value;
	const userName = inputUserName.value;

	firebase
		.auth()
		.createUserWithEmailAndPassword(email, password)
		.then((user) => {
			console.log('Success');
			user.name = userName;
		})
		.catch((error) => {
			console.error('code error');
			console.log(error.code);
			console.log(error.message);
		});
});
