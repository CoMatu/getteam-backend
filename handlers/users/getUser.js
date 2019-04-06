const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
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

