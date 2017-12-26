import { Router } from 'express'
import passport from 'passport'
import session from 'express-session';
import TwitterStrategy from 'passport-twitter'
import dotenv from 'dotenv'

const router = Router()
dotenv.config()

// セッションへの保存と読み出し ・・・・①
passport.serializeUser((user, callback) => {
  console.log('serializeUser', user);
  callback(null, user)
})

passport.deserializeUser((obj, callback) => {
  console.log('deserializeUser', obj);
  callback(null, obj)
})

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://localhost:3000'
},
// 認証後のアクション
(accessToken, refreshToken, profile, callback) => {
  process.nextTick(() => {
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile) // 必要に応じて変更
    return callback(null, profile)
  })
}))
router.use(session({
  secret: 'reply-analyzer',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize())
router.use(passport.session())

router.get('/callback', passport.authenticate('twitter', {failureRedirect: '/users' }), (req, res) => {
  console.log(res)
  console.log(req)
  res.redirect('/')
})

router.get('/', passport.authenticate('twitter'))

export default router

