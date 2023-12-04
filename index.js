const express = require("express");
const app = express();
const bcrypt = require('bcrypt')
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const passport = require('passport');
var session = require('express-session');

// Utils
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const { requestLogger, errorHandler } = require("./utils/middleware")
const { checkAuthenticated, checkNotAuthenticated } = require("./utils/auth")
const bodyParser = require('body-parser');

// Models
const { User } = require('./models/user.js')
const { Score } = require('./models/score.js')
// Connecting to database
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connection to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'template')));
app.use(bodyParser.urlencoded({ extended: true }));


// Passport session config
app.use(session({
    secret: 'something that is random',
    cookie: {
        maxAge: 60000 * 60 * 24 * 30
    },
    resave: false,
    name: 'passport.userpass'
}))
app.use(passport.authenticate('session'));

// Login
app.get("/login", checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/login.html'));
})

app.post('/login', function (request, response, next) {
    console.log('login')
    try {
        // Authenticate the username and password
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                // return next(err); // will generate a 500 error
                return response.redirect('/login_apology')
            }
            if (!user) {
                // return next({ statusCode: 404, message: info.message })
                return response.redirect('/login_apology')
            }

            // Log the user in,create user session and send a authorization token to the client
            request.login({ id: user.id, username: user.username }, loginErr => {
                if (loginErr) {
                    // return next(loginErr);
                    return response.redirect('/login_apology')
                }
                return response.redirect('/')
            });
        })(request, response, next);
    } catch (error) {
        // return next(error)
        return response.redirect('/login_apology')
    }
});

// Register
app.get("/register", checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/register.html'));
})
app.post('/register', async function (request, response, next) {
    console.log('register')
    console.log(request.body)
    try {
        // Check user input to make sure they didnt input an empty username, password, name
        if (!(request.body.username.trim() && request.body.password.trim())) {
            // return next({ statusCode: 422, message: "Username, Password, or Name do not follow criteria" })
            return response.redirect('/register_apology')
        }

        // Check to see if the user already exists, if they do then send an error message
        const userExist = await User.findOne({ username: request.body.username })
        if (userExist) {
            // return next({ statusCode: 409, message: "Username is already taken" })
            return response.redirect('/register_apology')
        }

        // Create new user
        const newUser = new User({
            username: request.body.username,
            name: request.body.name,
            passwordHash: await bcrypt.hash(request.body.password, 10),
        })

        const user = await newUser.save()

        // Log the user in, create a session and send an authorization token to the client
        request.login({ id: user.id }, function (error) {
            if (error) {
                // return next(error);
                return response.redirect('/register_apology')
            }
            return response.redirect("/")
        })
    } catch (error) {
        // return next(error)
        return response.redirect('/register_apology')
    }
});

// Logout
app.post('/logout', function (request, response, next) {
    // Remove the session token and log the user out
    request.logout(function (err) {
        if (err) { return next(err); }
        // response.redirect("/login")
    });
});

// Main App
app.get("/", checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/index.html'));
})
app.get('/static/:file', (req, res) => {
    const { file } = req.params
    res.sendFile(path.join(__dirname + `/static/${file}`));
});

// Score Controller
app.get('/scores', checkAuthenticated, async (request, response) => {
    try {
        const data = await Score.find({ user_id: request.user.id })
        response.send(data)
    } catch (error) {
        console.log(error)
    }
})

app.post('/scores', checkAuthenticated, async (request, response) => {
    const { id, username } = request.user;
    const { minutes, datasetIndex, accuracy, score } = request.body
    const newScore = new Score({
        user_id: id,
        username,
        minutes,
        datasetIndex,
        accuracy,
        score
    })
    try {
        await newScore.save()
        const leaderboard_data = await Score.find({ minutes: minutes, datasetIndex: datasetIndex }).sort({ score: -1 }).limit(15)
        response.send(leaderboard_data)
    } catch (error) {
        console.log(error)
    }
})

app.post('/deletescores', checkAuthenticated, async (request, response) => {
    await Score.deleteMany({ user_id: request.user.id })
    response.redirect('/')
})

// Apology htmls
app.get('/register_apology', (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/register_apology.html'));
})
app.get('/login_apology', (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/login_apology.html'));
})
app.use(errorHandler)

app.listen(config.PORT, () => {
    logger.info('Sever live on PORT ', config.PORT);
})