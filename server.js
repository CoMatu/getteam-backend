const Koa = require('koa')
const cors = require('@koa/cors')
const logger = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport'); //реализация passport для Koa
const Router = require('koa-router')

const addPerson = require('./handlers/people/addPerson')
const getPeople = require('./handlers/people/getPeople')
const deletePerson = require('./handlers/people/deletePerson')
const updatePerson = require('./handlers/people/updatePerson')

const addDepartment = require('./handlers/departments/addDepartment')
const getDepartments = require('./handlers/departments/getDepartments')
const deleteDepartment = require('./handlers/departments/deleteDepartment')
const updateDepartment = require('./handlers/departments/updateDepartment')

const addPosition = require('./handlers/positions/addPosition')
const getPositions = require('./handlers/positions/getPositions')
const deletePosition = require('./handlers/positions/deletePosition')
const updatePosition = require('./handlers/positions/updatePosition')

const addPoll = require('./handlers/polls/addPoll')
const getPolls = require('./handlers/polls/getPolls')
const deletePoll = require('./handlers/polls/deletePoll')
const updatePoll = require('./handlers/polls/updatePoll')

const addTest = require('./handlers/tests/addTest')
const getTests = require('./handlers/tests/getTests')
const deleteTest = require('./handlers/tests/deleteTest')
const updateTest = require('./handlers//tests/updateTest')

const getUsers = require('./handlers/users/getUsers')
const getUser = require('./handlers/users/getUser')
const insertUser = require('./handlers/users/insertUser')

const login = require('./handlers/auth/login')

const server = new Koa()
const router = new Router()

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

.post('/department/add', addDepartment)
.get('/departments', getDepartments)
.delete('/department/delete', deleteDepartment)
.put('/department/update', updateDepartment)

.post('/position/add', addPosition)
.get('/positions', getPositions)
.delete('/position/delete', deletePosition)
.put('/position/update', updatePosition)

.get('/people', getPeople)
.post('/people/add', addPerson)
.delete('/people/delete', deletePerson)
.put('/people/update', updatePerson)

.post('/polls/add', addPoll)
.get('/polls', getPolls)
.delete('/polls/delete', deletePoll)
.post('/polls/update', updatePoll)

.post('/tests/add', addTest)
.get('/tests', getTests)
.delete('/tests/delete', deleteTest)
.post('/tests/update', updateTest)