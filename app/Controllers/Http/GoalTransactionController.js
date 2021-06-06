'use strict'

const GoalTransaction = use('App/Models/GoalTransaction')
const Goal = use('App/Models/Goal')

class GoalTransactionController {
    async index({ auth }) {
        const user = auth.current.user

        //const goals = await user.goals().whith('goals_transactions').fetch()
        const goalTransactions = await user.goal_transactions().fetch()

        return goalTransactions;
    }

    async goalTransaction({ auth, response, params }) {

        const user = auth.current.user

        const goalTransaction = await GoalTransaction.find(params.idT)

        if (user.id == goalTransaction.user_id) {
            try {
                return goalTransaction
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem geting goal transaction, please try again later.555'
                })
            }
        } else {
            return response.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    }

    async create({ request, auth, response,params }) {
        // get currently authenticated user
        const user = auth.current.user        

       // const account = await Account.find(request.input('account_id'))

        if (user.id) {
           
            // Save goal to database
            try {
                const goalTransaction = await GoalTransaction.create({
                    user_id: user.id,
                    goal_id: request.params.id,                    
                    value: request.input('value'),
                    date: request.input('date'),
                })                

                return response.json({
                    status: 'success',
                    message: 'Goal Transaction Created!',
                    data: goalTransaction
                })
            } catch (error){
                console.log(error)
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem creating the goal transaction, please try again later.111'
                })
            }
        } else {
            return response.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    }

    async update({ request, auth, response, params }) {

        const user = auth.current.user

        const goalTransaction = await GoalTransaction.find(params.idT)

        //const account = await Account.find(goal.account_id);

        if (user.id) {
            try {
                goalTransaction.value = request.input('value')
                goalTransaction.date = request.input('date')

                await goalTransaction.save()

                return response.json({
                    status: 'success',
                    message: 'Goal Transaction Updated!',
                    data: goalTransaction
                })

            } catch (error) {
                console.log(error)
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem updating the goal transaction, please try again later.222'
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
        const user = auth.current.user

        const goalTransaction = await GoalTransaction.find(params.idT)

       // const account = await Account.find(goal.account_id);

        if (user.id) {
            try {

                await goalTransaction.delete()

                return response.json({
                    status: 'success',
                    message: 'Goal Transaction Deleted!',
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem deleting the goal transaction, please try again later.333'
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

module.exports = GoalTransactionController
