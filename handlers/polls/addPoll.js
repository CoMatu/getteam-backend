const db = require('../../models/db')
const r = require('rethinkdb')

module.exports = async(ctx, next) => {
    await next()

    const connection = await db()

    var exists = await r.tableList().contains('polls').run(connection)
    if (exists === false) {
      ctx.throw(500, 'polls table does not exist')
    }

    let body = ctx.request.body || {}

    console.log('получаем - ', body.questions[0])

    let document = {
      userId: body.userId, // для разграничения по пользователям
      date: body.date,
      pollTitle: body.pollTitle,
      pollDescription: body.pollDescription || '',
      questions: body.questions
    }

    console.log('документ - ', document)

    var result = await r.table('polls')
    .insert(document, {returnChanges: true})
    .run(connection)

  ctx.body = result
  }