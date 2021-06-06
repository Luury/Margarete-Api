'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Goal extends Model {
    goal_transaction() {
        return this.hasMany('App/Models/GoalTransaction')
      }
}

module.exports = Goal
