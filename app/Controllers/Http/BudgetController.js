'use strict'


const Budget = use('App/Models/Budget')
const Transaction = use('App/Models/Transaction');

class BudgetController {

    async index({ auth }) {
        const user = auth.current.user

        var budgets = await user.budgets().fetch()
        budgets = budgets.rows

        var transactions = await user.transactions().fetch()
        transactions = transactions.rows
        

        budgets.forEach(item => {
            var CategoryTransactions = transactions.filter((transaction) => transaction.category_id == item.id);
            console.log(CategoryTransactions)
            const budgetAmount = CategoryTransactions.length;

            var budget = CategoryTransactions.map((transaction) => {
                return transaction.value;
            })
    
            if (budgetAmount === 0) {
                budget = 0.00
            } else {
                budget = budget.reduce((total, currentElement) => total + currentElement)
            }

            var percentage = budget/item.value

            item.budget = budget
            item.budgetAmount = budgetAmount
            item.percentage = percentage
        });

        return budgets;
    }

    async budget({ auth, response, params }) {

        const user = auth.current.user

        const budget = await Budget.find(params.id)

        if (user.id == budget.user_id) {
            try {
                return budget
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem geting budget, please try again later.'
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
        let today = new Date()
        var month = today.getMonth()+1
        const budget = await Budget.create({
            
            user_id: user.id,
            category_id: request.input('category_id'),
            description: request.input('description'),
            month_start: month,
            value: request.input('value')
        })

        return response.json({
            status: 'success',
            message: 'Budget Created!',
            data: budget
        })
    }

    async update({ request, auth, response, params }) {

        const budget = await Budget.find(params.id)
        let today = new Date()
        var month = today.getMonth()+1

        if (auth.current.user.id == budget.user_id) {
            try {
                budget.description = request.input('description'),
                budget.month_start = month,
                budget.value = request.input('value')

                await budget.save()

                return response.json({
                    status: 'success',
                    message: 'Budget Updated!',
                    data: budget
                })

            } catch (error) {
                console.log(error)
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem updating the budget, please try again later.'
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

        const budget = await Budget.find(params.id)

        if (auth.current.user.id == budget.user_id) {
            try {

                await budget.delete()

                return response.json({
                    status: 'success',
                    message: 'Budget Deleted!',
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem deleting the budget, please try again later.'
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

module.exports = BudgetController
