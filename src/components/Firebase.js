import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseKey from './keys/firebaseKey';


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
export const dB = firebase.database();

export const dbRaces = firebase.firestore().collection('races');
export const dbRacesToPaddlers = firebase.firestore().collection('racesToPaddlers');
export const dbAttendance = firebase.firestore().collection('practiceAttendance');
export const dbAllPaddlers = firebase.firestore().collection('allPaddlers');

// export const dbRaces = firebase.firestore().collection('dev-races');
// export const dbRacesToPaddlers = firebase.firestore().collection('dev-racesToPaddlers');
// export const dbAttendance = firebase.firestore().collection('dev-practiceAttendance');
// export const dbAllPaddlers = firebase.firestore().collection('dev-allPaddlers');
export default firebase;
