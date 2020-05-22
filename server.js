'use strict'

const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const lessMiddleware = require('less-middleware')
const config = require('config')
const helpers = require('./utils/helpers')
const routes = require('./routes')
const logger = require('./utils/logger')
const staticify = require('staticify')(path.join(__dirname, 'public'))

const app = express()

// handlebars view engine setup
const hbs = exphbs.create({
  extname: '.handlebars',
  defaultLayout: 'main',
  helpers: helpers,
  partialsDir: 'views/partials/'
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// tools
app.use(favicon(path.join(__dirname, '/public/images/icons/favicon.ico')))
app.use(lessMiddleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'))
app.use(staticify.middleware)
app.use((req, res, next) => {
  staticify.refresh()
  app.locals.bust = staticify.getVersionedPath
  next()
})

// routes
routes(app)

// error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  let params = {}
  if (config.get('app.show_errors')) {
    params = { error: err }
  }

  return res.status(err.status || 500).render('error', params)
})

process.on('unhandledRejection', function (reason, p) {
  logger.error('Unhandled Rejection:', reason.stack)
  process.exit(1)
})

// start server
app.listen(config.get('app.port'), function () {
  logger.info(`${config.get('app.name')} server listening on: ${config.get('app.port')}`)
})

module.exports = app
