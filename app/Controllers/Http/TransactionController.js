'use strict'

const Transaction = use('App/Models/Transaction');
const Account = use('App/Models/Account');
const Goal = use('App/Models/Goal');
const Category = use('App/Models/Category');

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

        const user = auth.current.user
        const account = await Account.find(request.input('account_id'))
        const goal = await Goal.find(request.input('goal_id'))
        const category = await Category.find(request.input('category_id'))

        if (user.id == account.user_id && user.id == category.user_id) {
            if (request.input('type') != 3) {
                try {
                    const transaction = await Transaction.create({
                        account_id: request.input('account_id'),
                        goal_id: null,
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
            } else if (request.input('type') == 3 && user.id == goal.user_id) {
                try {
                    const transaction = await Transaction.create({
                        account_id: request.input('account_id'),
                        goal_id: request.input('goal_id'),
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
        const account = await Account.find(request.input('account_id'))
        const goal = await Goal.find(request.input('goal_id'))
        const category = await Category.find(request.input('category_id'))

        if (user.id == account.user_id && user.id == category.user_id) {
            if (request.input('type') != 3) {
                try {
                    transaction.type = request.input('type')
                    transaction.description = request.input('description')
                    transaction.account_id = request.input('account_id')
                    transaction.goal_id = null
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
            } else if (request.input('type') == 3 && user.id == goal.user_id) {
                try {
                    transaction.type = request.input('type')
                    transaction.description = request.input('description')
                    transaction.account_id = request.input('account_id')
                    transaction.goal_id = request.input('goal_id')
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
