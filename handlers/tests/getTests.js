const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

  // Get the db connection.
  const connection = await db()

  // Check if a table exists.
  var exists = await r.tableList().contains('tests').run(connection)
  if (exists === false) {
    ctx.throw(500, 'tests table does not exist')
  }

  let userId = ctx.query.userId || {}

  // Retrieve documents.
  var cursor = await r.table('tests')
    .filter(r.row('userId').eq(userId))
    .run(connection)

  var polls = await cursor.toArray()

  ctx.type = 'json'
  ctx.body = polls
  }