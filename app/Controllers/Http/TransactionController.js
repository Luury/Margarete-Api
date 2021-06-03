'use strict'

const Transaction = use('App/Models/Transaction');
const Account = use('App/Models/Account');

class TransactionController {

    async index({ auth }) {
        const user = auth.current.user

        const transactions = await user.transactions().fetch()

        return transactions;
    }

    async transaction({ auth, response, params }) {

        const user = auth.current.user

        const transaction = await Transaction.find(params.id)

        const account = await Account.find(transaction.account_id);

        if (user.id == account.user_id) {
            try {
                return transaction
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem geting transaction, please try again later.'
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

        const account = await Account.find(request.input('account_id'))

        if (user.id == account.user_id) {
            // Save transaction to database
            try {
                const transaction = await Transaction.create({
                    account_id: request.input('account_id'),
                    type: request.input('type'),
                    description: request.input('description'),
                    date: request.input('date'),
                    category_id: request.input('category_id'),
                    value: request.input('value')
                })

                return response.json({
                    status: 'success',
                    message: 'Transaction Created!',
                    data: transaction
                })
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem creating the transaction, please try again later.'
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

        const transaction = await Transaction.find(params.id)

        const account = await Account.find(transaction.account_id);

        if (user.id == account.user_id) {
            try {
                transaction.type = request.input('type')
                transaction.description = request.input('description')
                transaction.date = request.input('date')
                transaction.category_id = request.input('category_id')
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

    async delete({ auth, response, params }) {
        const user = auth.current.user

        const transaction = await Transaction.find(params.id)

        const account = await Account.find(transaction.account_id);

        if (user.id == account.user_id) {
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
