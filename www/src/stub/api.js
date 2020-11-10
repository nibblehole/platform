let state = {
  loggedIn: false,
  credentials: {
    user: '11',
    password: '2'
  }
}

const apps = {
  apps: [
    {
      id: "wordpress",
      name: "WordPress",
      icon: "/images/wordpress-128.png",
      url: "http://wordpress.odroid-c2.syncloud.it"
    }
  ]
};

const app_info = {
  info: {
    app: {
      id: "wordpress",
      name: "Wordpress",
      required: true,
      ui: false,
      url: "http://wordpress.odroid-c2.syncloud.it",
      icon: "/images/wordpress-128.png"
    },
    current_version: "190411412",
    installed_version: "190211412"
  }
};

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
    res.json(apps)
  })
  app.get('/rest/app', function (req, res) {
    res.json(app_info)
  })
  app.get('/rest/upgrade', function (req, res) {
    res.json({success: true})
  })
  app.get('/rest/remove', function (req, res) {
    res.json({success: true})
  })
  app.get('/rest/settings/installer_status', function (req, res) {
    res.json({success: true, is_running: false})
  })
}

exports.mock = mock
