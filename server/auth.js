import { Router } from 'express'
import passport from 'passport'
import session from 'express-session'
import TwitterStrategy from 'passport-twitter'
import dotenv from 'dotenv'

const router = Router()
dotenv.config()

// セッションへの保存と読み出し ・・・・①
passport.serializeUser((user, callback) => {
  // console.log('serializeUser', user)
  callback(null, user)
})

passport.deserializeUser((obj, callback) => {
  // console.log('deserializeUser', obj)
  callback(null, obj)
})

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://localhost:3000/auth/callback'
},
// 認証後のアクション
(token, tokenSecret, profile, done) => {
  passport.session.id = profile.id
  profile.twitter_token = token
  profile.twitter_token_secret = tokenSecret
  process.nextTick(function () {
    return done(null, profile)
  })
}))
router.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))
router.use(passport.initialize())
router.use(passport.session())

router.get('/callback', passport.authenticate('twitter', {failureRedirect: '/users' }), (req, res) => {
  req.session.authUser = {username: 'demo'}
  console.log(req.isAuthenticated())
  console.log(res)
  res.redirect('/')
})

router.get('/', passport.authenticate('twitter'))

export default router
