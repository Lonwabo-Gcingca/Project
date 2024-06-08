import express from  "express";
import bcrypt from "bcrypt";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, doc, collection, setDoc, getDoc, updateDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR9a99ubk6EkIIbSdc1gfRDPJcJeSeOUk",
  authDomain: "coffee-e-commerce-website.firebaseapp.com",
  projectId: "coffee-e-commerce-website",
  storageBucket: "coffee-e-commerce-website.appspot.com",
  messagingSenderId: "598470425091",
  appId: "1:598470425091:web:8c816dd3737f4017f8ac36"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

const app = express();

app.use(express.static("public"));
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile("index.html", {root: "public"})
})

app.get('/signup', (req, res) => {
    res.sendFile("signup.html", {root: "public"})
})

app.post('/signup', (req, res) => {
    const {name, email, password, number, tac} = req.body;

    if(name.length < 3){
        res.json({'alert':'name must be 3 letters long'});
    } else if(!email.length){
        res.json({'alert':'enter your email'});
    } else if(password.length < 8){
        res.json({'alert':'password must be 8 letters long'});
    }  else if(!tac){
        res.json({'alert':'you must agree to our terms and conditions'});
    }else{
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
                return res.json({ 'alert': 'email already exists'})
            } else{
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;


                        setDoc(doc(users, email), req.body).then(data => {
                            res.json({
                                name:req.body.name,
                                email:req.body.email,
                                seller:req.body.seller,
                            })
                        })
                    })
                })
            }
        })
    }
})

app.get('/login', (req, res) => {
    res.sendFile("login.html", {root: "public"})
})

app.post('/login', (req, res) => {
    let {email, password} = req.body;
    if(!email.length || !password.length){
        res.json({'alert':'fill all the inputs'})
    }

    const users = collection(db, "users");

    getDoc(doc(users, email))
    .then(user => {
        if(!user.exists()){
            return res.json({'alert':'email does not exist'});
        }else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name:data.name,
                        email:data.email,
                        seller:data.seller
                    })
                }
        })
    }
    })
})

app.get('/checkout', (req, res) => {
    res.sendFile("checkout.html", {root: "public"})
})

app.get('/dashboard',(req, res) =>{
    res.sendFile("dashboard.html",{root: "public"});
})

app.get('/add-product', (req, res) =>{
    res.sendFile("add-product.html", {root: "public"});
})

app.get('/404', (req, res) => {
    res.sendFile("404.html", {root: "public"})
})

app.use((req, res) => {
    res.redirect('/404')
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})

