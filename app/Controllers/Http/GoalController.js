'use strict'

const Goal = use('App/Models/Goal')
const Transaction = use('App/Models/Transaction');
//const Account = use('App/Models/Account');

class GoalController {

    async index({ auth }) {
        const user = auth.current.user

        var goals = await user.goals().fetch()
        goals = goals.rows

        var transactions = await user.transactions().fetch()
        transactions = transactions.rows

        goals.forEach(item => {
            var GoalsTransactions = transactions.filter((transaction) => transaction.goal_id == item.id);

            const investmentAmount = GoalsTransactions.length;

            var investment = GoalsTransactions.map((transaction) => {
                return transaction.value;
            })
    
            if (investmentAmount === 0) {
                investment = 0.00
            } else {
                investment = investment.reduce((total, currentElement) => total + currentElement)
            }

            var percentage = investment/item.value

            item.investment = investment
            item.investmentAmount = investmentAmount
            item.percentage = percentage
        });

        return goals;
    }

    async goal({ auth, response, params }) {

        const user = auth.current.user

        const goal = await Goal.find(params.id)

        if (user.id == goal.user_id) {
            try {
                return goal
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem geting goal, please try again later.'
                })
            }
        } else {
            return response.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    }

    async create({ request, auth, response }) {

        const user = auth.current.user

        const goal = await Goal.create({
            user_id: user.id,
            description: request.input('description'),
            date_start: request.input('date_start'),
            date_end: request.input('date_end'),
            value: request.input('value')
        })

        return response.json({
            status: 'success',
            message: 'Goal Created!',
            data: goal
        })
    }

    async update({ request, auth, response, params }) {

        const goal = await Goal.find(params.id)

        if (auth.current.user.id == goal.user_id) {
            try {
                goal.description = request.input('description')
                goal.date_start = request.input('date_start')
                goal.date_end = request.input('date_end')
                goal.value = request.input('value')

                await goal.save()

                return response.json({
                    status: 'success',
                    message: 'Goal Updated!',
                    data: goal
                })

            } catch (error) {
                console.log(error)
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem updating the goal, please try again later.'
                })
            }
        } else {
            return response.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    }

    async delete({ auth, response, params }) {

        const goal = await Goal.find(params.id)

        if (auth.current.user.id == goal.user_id) {
            try {

                await goal.delete()

                return response.json({
                    status: 'success',
                    message: 'Goal Deleted!',
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem deleting the goal, please try again later.'
                })
            }
        } else {
            return response.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    }
}

module.exports = GoalController
