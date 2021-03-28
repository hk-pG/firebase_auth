import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './config';
// 初期化
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;
