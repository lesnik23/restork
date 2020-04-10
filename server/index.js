const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const jwt = require('express-jwt')
app.use(
  jwt({
    secret: 'dummy',
    credentialsRequired: false
  }).unless({
    path: ['/auth/login']
  })
)

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/object', require('./routes/object'))
app.use('/api/object_type', require('./routes/object_type'))
app.use('/api/object_option', require('./routes/object_option'))
app.use('/api/room_option', require('./routes/room_option'))
app.use('/api/room_type', require('./routes/room_type'))
app.use('/api/application', require('./routes/application'))

async function start() {
  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(nuxt.render)
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
