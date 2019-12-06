import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import firebaseKey from './keys/firebaseKey'

const firebaseConfig = {
  apiKey: firebaseKey.apiKey,
  authDomain: "taz-occ.firebaseapp.com",
  databaseURL: "https://taz-occ.firebaseio.com",
  projectId: "taz-occ",
  storageBucket: "taz-occ.appspot.com",
  messagingSenderId: firebaseKey.messagingSenderId,
  appId: firebaseKey.appID,
  measurementId: firebaseKey.measurementId
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const FBProvider= new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();

export default firebase;