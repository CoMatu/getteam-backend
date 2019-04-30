const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

  // Get the db connection.
  const connection = await db()

  // Check if a table exists.
  var exists = await r.tableList().contains('people').run(connection)
  if (exists === false) {
    ctx.throw(500, 'people table does not exist')
  }

  let id = ctx.query.id || ''
  let _name = ctx.query.name || ''
  let _role = ctx.query.role || ''
  let _email = ctx.query.email || ''
  let _positionId = ctx.query.positionId || ''
  let _departmentId = ctx.query.departmentId || ''
  let _phone_1 = ctx.query.phone_1 || ''
  let _phone_2 = ctx.query.phone_2 || ''

  console.log('gjke -', _name)

  // Retrieve documents.
  var cursor = await r.table('people')
    .filter(r.row('id').eq(id))
    .update({
      name: _name,
      role: _role,
      email: _email,
      positionId: _positionId,
      departmentId: _departmentId,
      phone_1: _phone_1,
      phone_2: _phone_2
    })
    .run(connection)

  ctx.type = 'json'
  ctx.body = cursor
  }