'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BudgetSchema extends Schema {
  up () {
    this.create('budgets', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

      table.integer('category_id').unsigned().notNullable();
      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');
      
      table.string('description',90).notNullable()
      table.float('value').notNullable()
      table.integer('month_start').unsigned().notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('budgets')
  }
}

module.exports = BudgetSchema
