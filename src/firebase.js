import firebase from 'firebase/compat/app';




const firebaseConfig = {
  apiKey: "AIzaSyBQfozDPT6S7Mc9K5EwAKzNKrLuqRffF-c",
  authDomain: "bittupansari-dasti-accounts.firebaseapp.com",
  projectId: "bittupansari-dasti-accounts",
  storageBucket: "bittupansari-dasti-accounts.appspot.com",
  messagingSenderId: "486165846974",
  appId: "1:486165846974:web:54c81f47d5fd1f399137ef",
  measurementId: "G-YCS04HFRPN"
  };

  const Fire = firebase.initializeApp(firebaseConfig);

  export default Fire;