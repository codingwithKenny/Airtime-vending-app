

try {


    const res = await getDocs(colRef)
    console.log(res)
    res.forEach(details => {
        accdetailsStored.push({ ...details.data(), id: details.id })
        // console.log(details.id)


    });

    const signIn = await signInWithEmailAndPassword(auth, emailAddress, passWord)
        console.log(signIn)
   
    onAuthStateChanged(auth, (user) => {

            if (user) {
                nextPage()
            } else {
                handleLogOut()

            }

        })


    }


// i++
    // show.innerHTML += `
    // <td>${++i}</td>
    // <td>${data.data.phone}</td>
    // <td>${data.data.amount}</td>
    // <td>${data.data.network}</td>
    // <td>${data.data.orderId}</td>
    //  <td>${data.code}</td>
    // `







// const docRef = doc(db, 'userAccountDetails', detail.id)

            //   console.log(detailId)
            //      const resdoc = await getDoc(docRef)

            //      console.log(resdoc.data())









             // accdetailsStored.forEach(detail => {
                        //         console.log(detail)
                
                        //   });
                        // window.location.href = 'http://127.0.0.1:5500/dashboard.html';