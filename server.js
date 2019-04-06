const Koa = require('koa')
const cors = require('@koa/cors')
const logger = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport'); //реализация passport для Koa
const Router = require('koa-router')
const r = require('rethinkdb')

const addPerson = require('./handlers/people/addPerson')
const getPeople = require('./handlers/people/getPeople')

const getUsers = require('./handlers/users/getUsers')
const getUser = require('./handlers/users/getUser')
const insertUser = require('./handlers/users/insertUser')

const login = require('./handlers/auth/login')

/* 
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
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

router
.get('/users', getUsers)
.get('/users/:name', getUser)
.post('/users/auth/sign-in', login)
.post('/users/auth/sign-up', insertUser)
.get('/people', getPeople)
.post('/people/add', addPerson)

