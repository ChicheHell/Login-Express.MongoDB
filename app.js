//SECTOR VARIABLES
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    localStrategy = require('passport-local'),
    session = require('express-session'),
    user = require('./model/user.js')

//-----------------------CONECTING DATABASE----------------//

mongoose.connect('mongodb://localhost:27031/Prueba');

//--------MOTOR PLANTILLA

app.set('view engine', 'ejs');

//--------TOMA LA INFO DEL BODY
app.use(bodyParser.urlencoded({ extended: true }));

//-----ARCHIVO ESTATICOS
app.use(express.static('public'));

//-------CONFIGURACION DEL PASSPORT
app.use(session(
    {
        secret: "tuclave",
        resave: true,
        saveUninitialized: false
    }
));

//-------------------------
app.use(passport.initialize()); //Inicializa passport y podra trabajar con nuestra app
app.use(passport.session()); //Nos aseguramos que passport pueda acceder a las sesiones

//--------------------------
passport.use(new localStrategy(user.authenticate())); // Usamos el userSchema como localStrategy

passport.serializeUser(user.serializeUser()); // 
passport.deserializeUser(user.deserializeUser()); // 

//--------------RUTAS GET----------------------

app.get('/', (req, res) => {
    res.render('page/home')
});

app.get('/login', (req, res) => {
    res.render('page/login')
});

app.get('/register', (req, res) => {
    res.render('page/register')
});

app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('page/profile')
    } else {
        res.redirect('/login')
    }
});

//--------------RUTAS POST----------------------
app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}));

app.post("/register", (req, res) => {
    user.register(new user({
        username: req.body.username,
        phone: req.body.phone,
        telephone: req.body.telephone
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/login")
        })
    }
    )
})







app.listen('3033', () => {
    console.log("Se esta ejecutando")
});