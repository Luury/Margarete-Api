'use strict'

const Goal = use('App/Models/Goal')
//const Account = use('App/Models/Account');

class GoalController {

    async index({ auth }) {
        const user = auth.current.user

        const goals = await user.goals().fetch()

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
        // get currently authenticated user
        const user = auth.current.user
       // console.log(request)

       // const account = await Account.find(request.input('account_id'))

        if (user.id) {
            // Save goal to database
            try {
                const goal = await Goal.create({
                    user_id: user.id,
                    description: request.input('description'),
                    value_start: request.input('value_start'),
                    value_end: request.input('value_end'),
                    date_start: request.input('date_start'),
                    date_end: request.input('date_end'),
                    category_id: request.input('category_id'),
                })

                return response.json({
                    status: 'success',
                    message: 'Goal Created!',
                    data: goal
                })
            } catch (error){
                console.log(error)
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem creating the goal, please try again later.'
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

        const goal = await Goal.find(params.id)

        //const account = await Account.find(goal.account_id);

        if (user.id) {
            try {
                goal.description = request.input('description')
                goal.value_start = request.input('value_start')
                goal.value_end = request.input('value_end')
                goal.date_start = request.input('date_start')
                goal.date_end = request.input('date_end')
                goal.category_id = request.input('category_id')

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
        const user = auth.current.user

        const goal = await Goal.find(params.id)

       // const account = await Account.find(goal.account_id);

        if (user.id) {
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
