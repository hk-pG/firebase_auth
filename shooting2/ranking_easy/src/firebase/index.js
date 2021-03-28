import firebaseConfig from './config';
import firebase from 'firebase';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
