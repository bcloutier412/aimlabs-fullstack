const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const checkAuthenticated = (request, response, next) => {
  console.log('checking authentication')
  try {
    if (request.isAuthenticated()) { return next() }
    else { return response.redirect('/login') }
  } catch (error) {
    return next(error)
  }
}

const checkNotAuthenticated = (request, response, next) => {
  try {
    if (!request.isAuthenticated()) { return next() }
    return response.redirect("/")
  } catch (error) {
    return next(error)
  }
}

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  console.log('local strategy')
  try {
    const user = await User.findOne({ username: username });

    if (!user) { return cb(null, false, { message: 'Incorrect username or password' }); };
    const isValidLogin = await bcrypt.compare(password, user.passwordHash);
    if (!isValidLogin) { return cb(null, false, { message: 'Incorrect username or password' }); };

    return cb(null, user);
  } catch (error) {
    return cb(error)
  }

}));

passport.serializeUser(function (user, cb) {
  console.log('serializing')
  return cb(null, user.id)
});

passport.deserializeUser(async function (id, cb) {
  console.log('deserializing')
  const user = await User.findOne({ _id: id })
  if (!user) { return cb("User doesn't exist") }
  return cb(null, user)
});

module.exports = { checkAuthenticated, checkNotAuthenticated }