const Koa = require('koa')
const logger = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const r = require('rethinkdb')

const cors = require('koa2-cors')

const passport = require('koa-passport'); //реализация passport для Koa
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const server = new Koa()
const router = new Router()

const db = async() => {
    const connection = await r.connect({
        host: 'localhost',
        port: '28015',
        db: 'getteamDB'
    })
    return connection;
}

server
.use(passport.initialize())
.use(bodyParser())
.use(router.routes())
.use(router.allowedMethods())
.use(cors({
  origin: function(ctx) {
    if (ctx.url === '/test') {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
.use(logger('tiny')).listen(3001)


const getUsers = async(ctx, next) => {
    await next()

  // Get the db connection.
  const connection = await db()

  // Check if a table exists.
  var exists = await r.tableList().contains('users').run(connection)
  if (exists === false) {
    ctx.throw(500, 'users table does not exist')
  }

  // Retrieve documents.
  var cursor = await r.table('users')
    .run(connection)

  var users = await cursor.toArray()

  ctx.type = 'json'
  ctx.body = users
}

const insertUser = async(ctx, next) => {
    await next()
    // Get the db connection.
    const connection = await db()
  
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('users').run(connection)
    if (exists === false) {
      ctx.throw(500, 'users table does not exist')
    }
  
    let body = ctx.request.query || {}

    // Throw the error if no name.
    if (body.name === undefined) {
      ctx.throw(400, 'name is required')
    }
  
    // Throw the error if no email.
    if (body.email === undefined) {
      ctx.throw(400, 'email is required')
    }
  
    // Throw the error if no password.
    if (body.password === undefined) {
      ctx.throw(400, 'password is required')
    }

    // Throw the error if no role.
    if (body.role === undefined) {
      ctx.throw(400, 'role is required')
    }
  
    let document = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role
    }
  
    var result = await r.table('users')
      .insert(document, {returnChanges: true})
      .run(connection)
  
    ctx.body = result
  }

  const getUser = async(ctx, next) => {
    await next()
    let name = ctx.params.name

    // Throw the error if no name.
    if (name === undefined) {
      ctx.throw(400, 'name is required')
    }
  
    // Get the db connection.
    const connection = await db()
  
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('users').run(connection)
    if (exists === false) {
      ctx.throw(500, 'users table does not exist')
    }
  
    let searchQuery = {
      name: name
    }
  
    // Retrieve documents by filter.
    var user = await r.table('users')
      .filter(searchQuery)
      .nth(0) // query for a stream/array element by its position
      .default(null) // will return null if no user found.
      .run(connection)
  
    // Throw the error if no user found.
    if (user === null) {
      ctx.throw(400, 'no user found')
    }
  
    ctx.body = user
  }

  const login = async(ctx, next) => {
    await next()
//    console.log(ctx.request.query)
    ctx.body = 'получен запрос на авторизацию'
 }

router
.get('/users', getUsers)
.get('/users/:name', getUser)
.post('/users/auth/sign-in', login)
.post('/users/auth/sign-up', insertUser)

