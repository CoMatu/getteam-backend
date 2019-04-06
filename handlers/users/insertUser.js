module.exports = async(ctx, next) => {
    await next()
    // Get the db connection.
    const connection = await db()
  
    // Throw the error if the table does not exist.
    var exists = await r.tableList().contains('users').run(connection)
    if (exists === false) {
      ctx.throw(500, 'users table does not exist')
    }
  
    let body = ctx.request.body || {}

    console.log('получаем - ', body)

    // Throw the error if no name.
    if (body.fullName === undefined) {
      ctx.throw(400, 'name is required')
    }
  
    // Throw the error if no email.
    if (body.email === undefined) {
      ctx.throw(400, 'email is required')
    }
  
    // Throw the error if no password.
    if (body.password === undefined) {
      ctx.throw(400, 'password is required')
    }

    // Throw the error if no role.
    if (body.role === undefined) {
      body.role = 'user'
    }
  
    let document = {
      name: body.fullName,
      email: body.email,
      password: body.password,
      role: body.role
    }
  
    var result = await r.table('users')
      .insert(document, {returnChanges: true})
      .run(connection)
  
    ctx.body = result
}

