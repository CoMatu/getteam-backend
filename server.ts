const Koa = require('koa')
const logger = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const r = require('rethinkdb')

const cors = require('@koa/cors')

const passport = require('koa-passport'); //реализация passport для Koa
/* const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT
 */
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
.use(cors())
.use(passport.initialize())
.use(bodyParser())
.use(router.routes())
.use(router.allowedMethods())
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
    
      let body = ctx.request.body || {}

      console.log('получаем - ', body)

      // Throw the error if no name.
      if (body.fullName === undefined) {
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
        body.role = 'user'
      }
    
      let document = {
        name: body.fullName,
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
    let name = ctx.params.name // возможно будет ошибка, пока не проверял

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

    let body = ctx.request.body || {}

    let email = body.email
    let password = body.password

    // Throw the error if no name.
    if (email === undefined) {
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
      email: email
    }
  
    // Retrieve documents by filter.
    var user = await r.table('users')
      .filter(searchQuery)
      .nth(0) // query for a stream/array element by its position
      .default(null) // will return null if no user found.
      .run(connection)
  
    // Throw the error if no user found.
    if (user === null) {
      ctx.throw(400, 'такого пользователя не существует')
    }

    if (user.password === password) {

      ctx.body = true

    } else {
      ctx.throw(400, 'пароль не верный')
    }
//    console.log(ctx.request.query)
  }

  const getPeople = async(ctx, next) => {
    await next()

  // Get the db connection.
  const connection = await db()

  // Check if a table exists.
  var exists = await r.tableList().contains('people').run(connection)
  if (exists === false) {
    ctx.throw(500, 'people table does not exist')
  }

  // Retrieve documents.
  var cursor = await r.table('people')
    .run(connection)

  var people = await cursor.toArray()

  ctx.type = 'json'
  ctx.body = people
}


const addPerson = async(ctx, next) => {
  await next()

  const connection = await db()
  
  // Throw the error if the table does not exist.
  var exists = await r.tableList().contains('people').run(connection)
  if (exists === false) {
    ctx.throw(500, 'people table does not exist')
  }

  let body = ctx.request.query || {}

  console.log('fddfss -', ctx.request.body.name)

  console.log('получаем - ', body)

  let document = {
    userId: body.userId, // для разграничения по пользователям
    name: body.name,
    middleName: body.middleName,
    surname: body.surname,
    date: '',
    email: body.email,
    phone_1: '',
    phone_2: '',
    positionId: '',
    departmentId: ''
  }

  var result = await r.table('people')
  .insert(document, {returnChanges: true})
  .run(connection)

ctx.body = result
}


router
.get('/users', getUsers)
.get('/users/:name', getUser)
.post('/users/auth/sign-in', login)
.post('/users/auth/sign-up', insertUser)
.get('/people', getPeople)
.post('/people/add', addPerson)

