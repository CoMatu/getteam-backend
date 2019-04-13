const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

    const connection = await db()
    
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('departments').run(connection)
    if (exists === false) {
      ctx.throw(500, 'departments table does not exist')
    }

    let body = ctx.request.body || {}

    console.log('fddfss -', ctx.request.body.name)

    console.log('получаем - ', body)

    let document = {
      userId: body.userId, // для разграничения по пользователям
      name: body.name
    }

    var result = await r.table('departments')
    .insert(document, {returnChanges: true})
    .run(connection)

  ctx.body = result
  }