let state = {
  loggedIn: false,
  credentials: {
    user: '11',
    password: '2'
  }
}

var express = require('express')
var bodyparser = require('body-parser')
const mock = function (app, server, compiler) {
  app.use(express.urlencoded())
  app.use(bodyparser.json());
  app.post('/rest/login', function (req, res) {
    if (state.credentials.user === req.body.name && state.credentials.password === req.body.password) {
      state.loggedIn = true
      res.json({message: 'OK'})
    } else {
      res.status(400).json({message: 'Authentication failed'})
    }
  })
  app.get('/rest/user', function (req, res) {
    if (state.loggedIn) {
      res.json({message: 'OK'})
    } else {
      res.status(401).json({message: 'Authentication failed'})
    }
  })
  app.get('/rest/logout', function (req, res) {
    state.loggedIn = false
    res.json({message: 'OK'})
  })
  app.get('/rest/activation_status', function (req, res) {
    res.json({activated: true})
  })
  app.get('/rest/installed_apps', function (req, res) {
    res.json({apps: []})
  })
}

exports.mock = mock
