const state = {
  loggedIn: false,
  credentials: {
    user: '11',
    password: '2'
  },
  jobStatusRunning: false,
  availableAppsSuccess: true,
  activated: true
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

const deviceUrl = {
  device_url: 'http://test.syncloud.it',
  success: true
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
    if (!state.activated) {
      res.status(501).json({ message: 'Not activated' })
    } else {
      if (state.loggedIn) {
        res.json({ message: 'OK' })
      } else {
        res.status(401).json({ message: 'Authentication failed' })
      }
    }
  })
  app.post('/rest/logout', function (req, res) {
    state.loggedIn = false
    res.json({ message: 'OK' })
  })
  app.get('/rest/activation_status', function (req, res) {
    res.json({ activated: state.activated })
    // res.status(500).json({ message: "unknown activation status" })
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

  app.get('/rest/settings/device_url', function (req, res) {
    // res.status(500).json(deviceUrl)
    res.json(deviceUrl)
  })

  app.post('/rest/settings/deactivate', function (req, res) {
    state.activated = false
    res.json({})
  })
}

exports.mock = mock
