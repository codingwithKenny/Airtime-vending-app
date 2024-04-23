import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore,collection,addDoc,getDocs,query,where} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth,createUserWithEmailAndPassword,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAA75YqrIVKDFF-O97XaEhpTCRTPDTFg-E",
  authDomain: "airtime-30477.firebaseapp.com",
  projectId: "airtime-30477",
  storageBucket: "airtime-30477.appspot.com",
  messagingSenderId: "727260064796",
  appId: "1:727260064796:web:76e0048d7249afd9d383d9",
  measurementId: "G-9KMHS49LGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const colRef = collection(db, 'paymentdetails')
const userRef = collection(db, 'userDetails');



onAuthStateChanged(auth, async(user) => {
    console.log(user.email)
    console.log(window.location.href)

    if (user.email) {
      await getUserDetail(user.email)
     }
  
})

async function getUserDetail(email) {
  

  const q = query(userRef, where( "emailAddress", "==", email))
  try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
          console.log("No matching documents.");
          return;
      }

      querySnapshot.forEach((doc) => {
         
          getUserTransaction(doc.id)

          // console.log(data.code)
     });

  } catch (error) {
      console.log(error)
  }
}
  


async function getUserTransaction(userId) {
  console.log({userId});
  let showhistory = document.getElementById('show')
  let i =0;
  const q = query(colRef, where( "currentUserId", "==", userId))
  try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
          console.log("No matching documents.");
          console.log('empty')
          showempty.innerHTML = "NO TRANSACTION HAS BEEN MADE"
          return;
    }

      querySnapshot.forEach((doc) => {
        
          console.log(doc.id, " => ", doc.data());
          const data = { ...doc.data() }
          // console.log(data.data.data);
          showhistory.innerHTML += `
          <tr>
          <td>${i+1}</td>
          <td>${data.data.data.phone}</td>
          <td>${data.data.data.amount}</td>
          <td>${data.data.data.network}</td>
          <td>${data.data.data.order_id}</td>
          <td>${data.data.code}</td>
          </tr>
          `
          i++

          return { id: doc.id, data: doc.data() }

      

         
      });
     

  } catch (error) {
      console.log(error)
  }
}

  //           LOGOUT   
  function handleLogOut() {

    try {
        signOut(auth)
            .then(() => {
                window.location.href = 'http://127.0.0.1:5500/login.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    } catch (error) {
        console.error('Error:', error);
        
    }

}

logout.addEventListener('click', handleLogOut)
