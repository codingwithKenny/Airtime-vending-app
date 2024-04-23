import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore,collection,addDoc,getDocs} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth,createUserWithEmailAndPassword,onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const colreff = collection(db, 'paymentdetails')
let paymentDetail =[]


const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const currentUserId = urlParams.get('id')
        console.log(currentUserId)

onAuthStateChanged(auth, async (user) => {
    // console.log(user.email)
  if (user) {
    console.log(user.email)
   getAllPaymentDetails()

    
  }
    // PAYMENT INTEGRATION (PAYSTACK)
function payWithPaystack(e) {
    // console.log(user.email)
    e.preventDefault()

    let network_id = document.getElementById('choosenetwork').value
    let amount = document.getElementById('amount').value*100
    let phone = document.getElementById('phonenumber').value

    let handler =  PaystackPop.setup({
        key:'public-key-paystack',
        email:user.email,
        amount: document.getElementById('pay').value * 100,
        ref: Math.floor(Math.random()* 1000000000 + 1),
        onclose : function(){
            console.log("window closed")

        },
        callback: function(response){
            let res = 'Payment complete! Reference: ' + response.reference;
             alert(res);  
               if(res){
                loading.style.display = "block"
               }else{
                
               }
             

             
             purchaseAirtime(phone,network_id,amount, currentUserId)
            
             
        }
        
    })
    handler.openIframe();
  
    
}
buyAirtime.addEventListener('submit',payWithPaystack)


})

//........ INTEGRATE VTU API...............

 function purchaseAirtime(phone,network_id,amount,currentUserId) { 
    const username = 'username'
    const password = 'password'

    const url = `https://vtu.ng/wp-json/api/v1/airtime?username=${(username)}&password=${(password)}&phone=${(phone)}&network_id=${(network_id)}&amount=${(amount/100)}&currentUserId=${currentUserId}`;
 fetch(url)
 .then(response => {
       return response.json();
  })
  .then(data => {
    console.log(data)
    if(data){
        loading.style.display = "none"
    }
      showModalMessage(data.message)
     const  transactions ={
        data,
        currentUserId,

      }

    addDoc(colreff, transactions)
   
    console.log(transactions)


  })
  
  
  .catch(error => console.error('Error:', error));
   
}

// DISCOUNT FOR USER

function  handleAmountToPay(){

    let amount = document.getElementById('amount').value
    let  discount = amount*0.01
      document.getElementById('pay').value = amount - discount

}  
document.getElementById('amount').addEventListener('input', handleAmountToPay)

 async function getAllPaymentDetails() {
     const res = await getDocs(colreff)
     console.log(res)
     res.forEach(item => {
      paymentDetail.push({...item.data(), id:item.id})

     });
    
}
   function nextPage(){

    window.location.href = "http://127.0.0.1:5500/paymentHistory.html"
        
}
      historybutton.addEventListener('click', nextPage)

//... .........LOGOUT ................
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

  //..............TO SHOW MODAL.............
  function showModalMessage(message) {
    modal.style.display = 'block'
    modal.style.transform = 'scale(1.2)';
    modal.innerHTML = `
    <div>
        <h3 id="massagetext">${message}</h3>
        <button  id="modalbtn" >Okay</button>

    </div>`
    modalbtn.addEventListener('click', async () => {

        modal.style.display = 'none'

    })
}

// showModalMessage('hello')


// CONFIRM NETWORK

        async function checkCarrier() {
            // alert('seen')
            let regex=/^\+234[0-9]{10,11}$/;
            let phoneNumber = document.getElementById('phonenumber').value;


            if (!regex.test(phoneNumber)) {
                alert('INvalid')
                return
            }

            phoneNumber=[...phoneNumber]

            console.log(phoneNumber[4]);
            if (phoneNumber[4]=='0') {
                phoneNumber.splice(4,1)
            }


            phoneNumber=phoneNumber.join('')

            //     console.log(phoneNumber);

            // return;


            // alert()
            const apiKey = 'apikey'; // Use the public API key if required
            const url = `https://api.ng.termii.com/api/check/dnd?api_key=${apiKey}&phone_number=${phoneNumber}
            `;

            try {
               
                const response = await fetch(url);
                const data = await response.json();
                console.log(data)
                let network = data.network_code.split(" ")[0]
               
                document.getElementById('choosenetwork').value = network.toLowerCase()
                others.style.display="block"

            } catch (error) {
                console.error('Error fetching carrier information:', error);
                document.getElementById('choosenetwork').value = 'Error fetching carrier information';
            }
        }
         phonenumber.addEventListener('blur',checkCarrier )
   