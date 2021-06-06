'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GoalTransactionSchema extends Schema {
  up () {
    this.create('goal_transactions', (table) => {
      table.increments()

      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

      table.integer('goal_id').unsigned().notNullable();
      table.foreign('goal_id').references('id').inTable('goals').onDelete('CASCADE');

      table.float('value').notNullable()
      table.date('date').notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('goal_transactions')
  }
}

module.exports = GoalTransactionSchema
