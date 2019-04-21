const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

    const connection = await db()
    
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('people').run(connection)
    if (exists === false) {
      ctx.throw(500, 'people table does not exist')
    }

    let body = ctx.request.body || {}

    console.log('name -', ctx.request.body.name)

    let document = {
      userId: body.userId, // для разграничения по пользователям
      name: body.name,
      date: body.date,
      email: body.email || '',
      phone_1: body.phone_1 || '',
      phone_2: body.phone_2 || '',
      positionId: body.positionId || '',
      departmentId: body.departmentId || ''
    }

    var result = await r.table('people')
    .insert(document, {returnChanges: true})
    .run(connection)

  ctx.body = result
  }

