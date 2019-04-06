module.exports = async(ctx, next) => {
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

