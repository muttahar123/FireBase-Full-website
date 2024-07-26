 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
 import { getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword ,
    signOut 
    } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    import {
      getFirestore,
      collection,
      addDoc,
      getDocs,
      doc, deleteDoc, updateDoc
    } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
    import {
      getStorage,
      ref,
      uploadBytes,
      getDownloadURL,
    } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
    // Your web app's Firebase configuration

 const firebaseConfig = {
   apiKey: "AIzaSyBbTWwY0aKf7YqGrd_ehctzKK-sKNvyCj8",
   authDomain: "this-is-my-first-prject-ac171.firebaseapp.com",
   projectId: "this-is-my-first-prject-ac171",
   storageBucket: "this-is-my-first-prject-ac171.appspot.com",
   messagingSenderId: "951577190072",
   appId: "1:951577190072:web:6ed85ccd40b7fa08a71e4d",
   measurementId: "G-YS4RDC3XK5"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);;
 const analytics = getAnalytics(app);
 const auth = getAuth(app);
 const db = getFirestore(app);
const storage = getStorage(app);

const numbers_list = document.getElementById("numbers_list");
const add_number = document.getElementById("add_number");
const loading_message = document.getElementById("loading_message");
const numInp = document.getElementById("numInp");

//collection -> collection ke reference ke lye
//addDoc -> document ko collection mein add krne ke lye

const numberCollection = collection(db, "number");

getNumbersFromDb();

add_number.addEventListener("click", async () => {
  // Input field ki value check karna
  const number = numInp.value.trim();
  if (!number) {
    // alert("Please enter a number");
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter the number",
      footer: '<a href="#">Why do I have this issue?</a>'
    });
    return;
  }
  console.log(number);
  try {
    add_number.disabled = true;
    const docRef = await addDoc(numberCollection, {
      number,
    });
    add_number.disabled = false;
    numInp.value = ""; // Clear the input field after adding the number
    getNumbersFromDb();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    add_number.disabled = false;
    console.error("Error adding document: ", e);
  }
});

async function getNumbersFromDb() {
  numbers_list.innerHTML = "";
  loading_message.style.display = "block";

  const querySnapshot = await getDocs(numberCollection);
  numbers_list.innerHTML = "";
  querySnapshot.forEach((doc) => {
    var obj = doc.data();
    const li = `<li id=${doc.id}> <b>${obj.number}</b> <button> Edit </button> <button> Delete </button> </li>`;
    numbers_list.innerHTML += li;
  });

  loading_message.style.display = "none";

  numbers_list.childNodes.forEach((node) => {
    node.children[1].addEventListener("click", async function () {
      const docRef = doc(db, "number", this.parentNode.id);
      const newNumber = prompt("New Number");

      await updateDoc(docRef, {
        number: newNumber,
      });
      console.log("Document update hogya he");
      getNumbersFromDb();
    });

    node.children[2].addEventListener("click", async function () {
      const docRef = doc(db, "number", this.parentNode.id);
      await deleteDoc(docRef);
      console.log("Doc deleted");
      getNumbersFromDb();
    });
  });
}

const carsCollection = collection(db, "cars");
console.log("storage=>", storage);

const car_img = document.getElementById("car_img");
const save_file = document.getElementById("save_file");
const container = document.getElementById("container");

getImagesFromDB();

 const signUp_email = document.getElementById("signUp_email");
 const signUp_password = document.getElementById("signUp_password");
 const signUp_btn = document.getElementById("signUp_btn");

 const signIn_email = document.getElementById("signIn_email");
 const signIn_password = document.getElementById("signIn_password");
 const signIn_btn = document.getElementById("signIn_btn");

 const user_email = document.getElementById('user_email')
 const logout_btn = document.getElementById('logout_btn')

 const auth_container = document.getElementById("auth_container")
 const user_container = document.getElementById("user_container")

 signUp_btn.addEventListener("click", createserAccount)
signIn_btn.addEventListener("click",signIn)
logout_btn.addEventListener("click" , logout)


onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("user is log in!");
        const uid = user.uid;
        auth_container.style.display = "none";
        user_container.style.display = "block";
        user_email.innerText = user.email;
    } else {
        console.log("user is not log in!");
        auth_container.style.display = "block";
        user_container.style.display = "none";
    }
});


function createserAccount(){
//     console.log('signup_email=>',signUp_email.value);
//     console.log('signUp_password=>',signUp_password.value);
createUserWithEmailAndPassword(auth, signUp_email.value, signUp_password.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log('user=>', user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // ..
  });
}

function signIn(){
    // console.log('signup_email=>',signIn_email.value);
    // console.log('signUp_password=>',signIn_password.value);
    signInWithEmailAndPassword(auth, signIn_email.value, signIn_password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("user");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
}

function logout(){
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}

save_file.addEventListener("click", () => {
  //console the first file from the input type file
  console.log(car_img.files[0]);

  const carStorageRef = ref(storage, car_img.files[0].name);

  //upload file to the storage
  save_file.disabled = true;
  uploadBytes(carStorageRef, car_img.files[0])
    .then((snapshot) => {
      console.log("Uploaded  file!");

      // get url from the same storage ref
      getDownloadURL(carStorageRef)
        .then((url) => {
          console.log("url=>", url);

          //add url + category to the db
          addDoc(carsCollection, { url, category: "car" }).then(() => {
            console.log("Document updated to the DB");
            getImagesFromDB();
            save_file.disabled = false;
          });
        })
        .catch((err) => {
          console.log("Error in download=>", err), (save_file.disabled = false);
        });
    })
    .catch((err) => {
      console.log(err), (save_file.disabled = false);
    });
});

async function getImagesFromDB() {
  const querySnapshot = await getDocs(carsCollection);
  container.innerHTML = "";
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`);

    console.log(doc.data());

    const img = `<img
    id = ${doc.id}
    src = ${doc.data().url}
    style="height: 300px; width: 300px; border-radius: 12px; margin: 10px"
  />`;

    container.innerHTML += img;
  });
}