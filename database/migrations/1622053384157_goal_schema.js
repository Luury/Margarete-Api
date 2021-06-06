'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GoalSchema extends Schema {
  up () {
    this.create('goals', (table) => {
      table.increments()
      
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      
      table.string('description',90).notNullable()
      table.float('value_start').notNullable()
      table.float('value_end').notNullable()
      table.date('date_start').notNullable()
      table.date('date_end').notNullable()
 
      table.timestamps()
    })
  }

  down () {
    this.drop('goals')
  }
}

module.exports = GoalSchema
