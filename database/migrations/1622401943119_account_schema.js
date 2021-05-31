'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');

      table.integer('type').notNullable()
      table.string('description', 254).notNullable()
      table.float('balance').notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountSchema
