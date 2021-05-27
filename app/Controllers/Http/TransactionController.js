'use strict'

const Transaction = use('App/Models/Transaction');
const User = use('App/Models/User');

class TransactionController {

    async index({ auth }) {
        const id = auth.current.user.id

        const user = await User.find(id)

        const transactions = await user.transactions().fetch()

        return transactions;
    }

    async create({ request, auth }) {
        // get currently authenticated user
        const user = auth.current.user

        // Save transaction to database
        const transaction = await Transaction.create({
            user_id: user.id,
            type: request.input('type'),
            description: request.input('description'),
            date: request.input('date'),
            category: request.input('category'),
            value: request.input('value')
        })

        return response.json({
            status: 'success',
            message: 'Transaction Created!',
            data: transaction
        })
    }

    async update({request, auth, response, params }) {

        const transaction = await Transaction.find(params.id)

        if (auth.current.user.id ==  transaction.user_id) {
            try {
                transaction.type = request.input('type')
                transaction.description = request.input('description')
                transaction.date = request.input('date')
                transaction.category = request.input('category')
                transaction.value = request.input('value')

                await transaction.save()

                return response.json({
                    status: 'success',
                    message: 'Transaction Updated!',
                    data: transaction
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem updating the transaction, please try again later.'
                })
            }
        } else {
            return response.status(401).json({
                status: 'error',
                message: 'Unauthorized'
            })
        }
    }

    async delete({ auth, response, params}) {
        const transaction = await Transaction.find(params.id)

        if (auth.current.user.id ==  transaction.user_id) {
            try {
            
                await transaction.delete()

                return response.json({
                    status: 'success',
                    message: 'Transaction Deleted!',
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem deleting the transaction, please try again later.'
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

module.exports = TransactionController
