'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()

      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');

      table.integer('account_id').unsigned().notNullable();
      table.foreign('account_id').references('id').inTable('accounts');

      table.integer('type').notNullable()
      table.string('description', 254).notNullable()
      table.string('category', 254).notNullable()
      table.float('value').notNullable()
      table.date('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionSchema
