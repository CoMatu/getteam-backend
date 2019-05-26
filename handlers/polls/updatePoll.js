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

  let title = ctx.query.pollTitle
  const document = ctx.request.body

  let id = document.id

  let _date = document.date
  let _pollTitle = document.pollTitle
  let _pollDescription = document.pollDescription
  let _questions = document.questions

  var cursor = await r.table('polls')
    .filter(r.row('id').eq(id))
    .update({
        date: _date,
        pollTitle: _pollTitle,
        pollDescription: _pollDescription,
        questions: _questions
        })
    .run(connection)

  ctx.type = 'json'
  ctx.body = cursor
  }