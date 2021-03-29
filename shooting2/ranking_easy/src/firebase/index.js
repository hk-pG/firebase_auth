import firebaseConfig from './config';
import firebase from 'firebase';
import 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// const auth = firebase.auth();

export { db };
