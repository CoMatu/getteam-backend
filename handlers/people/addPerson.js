module.exports = async(ctx, next) => {
    await next()

    const connection = await db()
    
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('people').run(connection)
    if (exists === false) {
      ctx.throw(500, 'people table does not exist')
    }

    let body = ctx.request.query || {}

    console.log('fddfss -', ctx.request.body.name)

    console.log('получаем - ', body)

    let document = {
      userId: body.userId, // для разграничения по пользователям
      name: body.name,
      middleName: body.middleName,
      surname: body.surname,
      date: '',
      email: body.email,
      phone_1: '',
      phone_2: '',
      positionId: '',
      departmentId: ''
    }

    var result = await r.table('people')
    .insert(document, {returnChanges: true})
    .run(connection)

  ctx.body = result
  }

