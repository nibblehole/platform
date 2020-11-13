let state = {
  loggedIn: false,
  credentials: {
    user: '11',
    password: '2'
  },
  jobStatusRunning: false,
  availableAppsSuccess: false
}

const apps = {
  apps: [
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: '/images/wordpress-128.png',
      url: 'http://wordpress.odroid-c2.syncloud.it'
    }
  ]
}

const appInfo = {
  info: {
    app: {
      id: 'wordpress',
      name: 'Wordpress',
      required: true,
      ui: false,
      url: 'http://wordpress.odroid-c2.syncloud.it',
      icon: '/images/wordpress-128.png'
    },
    current_version: '190411412',
    installed_version: '190211412'
  }
}
const appcenterData = {
  apps: [
    {
      id: 'wordpress',
      name: 'WordPress',
      icon: '/images/wordpress-128.png'
    },
    {
      id: 'diaspora',
      name: 'Diaspora',
      icon: '/images/penguin.png'
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: '/images/penguin.png'
    },
    {
      id: 'talk',
      name: 'Talk',
      icon: '/images/penguin.png'
    },
    {
      id: 'files',
      name: 'Files Browser',
      icon: '/images/penguin.png'
    }
  ]
}

const appcenterDataError = {
  message: 'error',
  success: false
}

const express = require('express')
const bodyparser = require('body-parser')
const mock = function (app, server, compiler) {
  app.use(express.urlencoded())
  app.use(bodyparser.json())
  app.post('/rest/login', function (req, res) {
    if (state.credentials.user === req.body.name && state.credentials.password === req.body.password) {
      state.loggedIn = true
      res.json({ message: 'OK' })
    } else {
      res.status(400).json({ message: 'Authentication failed' })
    }
  })
  app.get('/rest/user', function (req, res) {
    if (state.loggedIn) {
      res.json({ message: 'OK' })
    } else {
      res.status(401).json({ message: 'Authentication failed' })
    }
  })
  app.post('/rest/logout', function (req, res) {
    state.loggedIn = false
    res.json({ message: 'OK' })
  })
  app.get('/rest/activation_status', function (req, res) {
    res.json({ activated: true })
  })
  app.get('/rest/installed_apps', function (req, res) {
    res.json(apps)
  })
  app.get('/rest/app', function (req, res) {
    res.json(appInfo)
  })
  app.post('/rest/upgrade', function (req, res) {
    res.json({ success: true })
  })
  app.post('/rest/install', function (req, res) {
    res.json({ success: true })
  })
  app.post('/rest/remove', function (req, res) {
    res.json({ success: true })
  })
  app.post('/rest/restart', function (req, res) {
    res.json({ success: true })
  })
  app.post('/rest/shutdown', function (req, res) {
    res.json({ success: true })
  })
  app.get('/rest/settings/installer_status', function (req, res) {
    res.json({ success: true, is_running: false })
  })
  app.post('/rest/backup/create', function (req, res) {
    res.json({})
  })
  app.get('/rest/job/status', function (req, res) {
    let response = {}
    if (state.jobStatusRunning) {
      response = { success: true, data: 'JobStatusBusy' }
    } else {
      response = { success: true, data: 'JobStatusIdle' }
    }
    state.jobStatusRunning = !state.jobStatusRunning
    res.json(response)
  })

  app.get('/rest/available_apps', function (req, res) {
    let response = {}
    if (state.availableAppsSuccess) {
      response = appcenterData
    } else {
      response = appcenterDataError
    }
    res.json(response)
  })

}

exports.mock = mock
