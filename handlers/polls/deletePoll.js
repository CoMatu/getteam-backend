const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

  // Get the db connection.
  const connection = await db()

  // Check if a table exists.
  var exists = await r.tableList().contains('polls').run(connection)
  if (exists === false) {
    ctx.throw(500, 'polls table does not exist')
  }

  let userId = ctx.query.userId || {}

  let id = ctx.query.id || {}
  console.log('проверка по ИД', userId)
  console.log('object id ', ctx.query)

  // Retrieve documents.
  var cursor = await r.table('polls')
    .filter(r.row('id').eq(id))
    .delete()
    .run(connection, function(err, result) {
      if (err) throw err;
      console.log(JSON.stringify(result, null, 2));
  })

  ctx.type = 'json'
  ctx.body = cursor
  }