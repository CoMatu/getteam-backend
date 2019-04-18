const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

    const connection = await db()

    // TODO нужна проверка на дублирование имен подразделений
    
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('positions').run(connection)
    if (exists === false) {
      ctx.throw(500, 'positions table does not exist')
    }

    let body = ctx.request.body || {}

    console.log('fddfss -', ctx.request.body.name)

    console.log('получаем - ', body)

    let document = {
      userId: body.userId, // для разграничения по пользователям
      name: body.name
    }

    var result = await r.table('positions')
    .insert(document, {returnChanges: true})
    .run(connection)

  ctx.body = result
  }