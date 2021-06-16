'use strict'

const Account = use('App/Models/Account');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    // Hook to add account
    this.addHook('afterCreate', async (userInstance) => {
      await Account.create({
        user_id: userInstance.id,
        type: "1",
        description: "Carteira",
      })

    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }
  accounts() {
    return this.hasMany('App/Models/Account')
  }
  transactions() {
    return this.manyThrough('App/Models/Account', 'transactions')
  }
  categories() {
    return this.hasMany('App/Models/Category')
  }
  goals() {
    return this.hasMany('App/Models/Goal')
  }
  budgets() {
    return this.hasMany('App/Models/Budget')
  }
}

module.exports = User
