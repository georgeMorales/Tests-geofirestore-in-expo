import firebase from "firebase";
import "firebase/firestore";



const firebaseConfig = {
   // Put sdk web configuration of firebase
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
// const settings = {
//   timestampsInSnapshots: false
// }
//firestore.settings(settings);


export default firebase;