/**
 * Created by tanner on 3/21/17.
 */
var express = require('express');
var app = express();

var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var sensitive = require('./sensitive');

app.use(session(sensitive.session));
app.use(passport.initialize());
app.use(passport.session());

var callbackURL = '/auth/facebook/callback';
passport.use(new FacebookStrategy(sensitive.facebook(callbackURL),
    function (token, refreshToken, profile, done)
    {
        return done(null, profile);
    }
));

passport.serializeUser(function (user, done)
{
    done(null, user);
});

passport.deserializeUser(function (obj, done)
{
    done(null, obj);
})

var port = 3000;
app.listen(port, function ()
{
    console.log('listening on port', port);
});
app.get('/', function (req, res)
{
    res.send('<p>Go to <a href="/auth/facebook">Facebook Login</a></p>')
});
app.get('/auth/facebook', passport.authenticate('facebook'),
    function (req, res)
    {
        res.send();
    });

app.get(callbackURL, passport.authenticate('facebook',
    {
        successRedirect: '/me',
        failureRedirect: '/'
    }),
    function (req, res)
    {
        res.send();
    });

app.get('/me',
    function (req, res)
    {
        res.send(req.user);
    });