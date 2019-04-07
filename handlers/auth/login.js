const db = require('../../models/db')
const r = require('rethinkdb')

const jwt = require('jsonwebtoken')
const { compare } = require('bcrypt')
const { config } = require('dotenv')

const SECRET = '22ll55';

/* const compareAsync = async(data, encrypted) => {
  return await compare(data, encrypted, (error, same) => {
    if (error) {
      console.log('get error - ', error)
        reject(error);
    }
    return true;
});

};
 */
module.exports = async(ctx, next) => {
    await next()

    let body = ctx.request.body || {}

    let email = body.email
    let password = body.password

    // Throw the error if no name.
    if (email === undefined) {
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
      email: email
    }
  
    // Retrieve documents by filter.
    var user = await r.table('users')
      .filter(searchQuery)
      .nth(0) // query for a stream/array element by its position
      .default(null) // will return null if no user found.
      .run(connection)
  
    // Throw the error if no user found.
    if (user === null) {
      ctx.throw(400, 'такого пользователя не существует')
    }
    if (user.password !== password) {
      ctx.body = {
          message: 'Invalid credentials'
      };
      return ctx.status = 422;
  }

      // Если такой юзер существует, то берем его `id` и хешируем в токене с помощью Вашего секретного ключа
      const tokenJWT = jwt.sign({
        user: user
      }, SECRET, {
          expiresIn: 864e5 // 1 день
      });

          // Далее сеттим токен в куках с флагом `httpOnly`, так безопаснее так как клиент не имеет доступ к ним
/*     ctx.cookies.set('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      expires: new Date(new Date().valueOf() + 864e5), // 1 день
      secure: true
  });
 */  
      ctx.body = {token: tokenJWT}

  }

