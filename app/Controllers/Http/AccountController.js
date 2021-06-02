'use strict'

const Account = use('App/Models/Account');
const User = use('App/Models/User');

class AccountController {

    async index({ auth }) {
        const user = auth.current.user

        var accounts = await user.accounts().fetch()
        accounts = accounts.rows

        var transactions = await user.transactions().fetch()
        transactions = transactions.rows


        accounts.forEach(item => {
            var AccountTransactions = transactions.filter((transaction) => transaction.account_id == item.id);

            const balanceAmount = AccountTransactions.length;

            var expense = AccountTransactions.filter((transaction) => transaction.type == 1);

            expense = expense.map((transaction) => {
                return transaction.value;
            })

            const expenseAmount = expense.length;

            if (expense.length === 0) {
                expense = 0.00
            } else {
                expense = expense.reduce((total, currentElement) => total + currentElement)
            }

            var revenue = AccountTransactions.filter((transaction) => transaction.type == 2);

            revenue = revenue.map((transaction) => {
                return transaction.value;
            })

            const revenueAmount = revenue.length

            if (revenue.length === 0) {
                revenue = 0.00
            } else {
                revenue = revenue.reduce((total, currentElement) => total + currentElement)
            }

            const balance = revenue - expense

            item.balance = balance
            item.expense = expense
            item.revenue = revenue
            item.balanceAmount = balanceAmount
            item.revenueAmount = revenueAmount
            item.expenseAmount = expenseAmount
        });

        return accounts;
    }

    async account({ auth, response, params }) {

        const account = await Account.find(params.id)

        if (auth.current.user.id == account.user_id) {
            try {
                return account
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem geting account, please try again later.'
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

        // Save account to database
        const account = await Account.create({
            user_id: user.id,
            type: request.input('type'),
            description: request.input('description'),
        })

        return response.json({
            status: 'success',
            message: 'Account Created!',
            data: account
        })
    }

    async update({ request, auth, response, params }) {

        const account = await Account.find(params.id)

        if (auth.current.user.id == account.user_id) {
            try {
                account.type = request.input('type')
                account.description = request.input('description')

                await account.save()

                return response.json({
                    status: 'success',
                    message: 'Account Updated!',
                    data: account
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem updating the account, please try again later.'
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
        const account = await Account.find(params.id)

        if (auth.current.user.id == account.user_id) {
            try {

                await account.delete()

                return response.json({
                    status: 'success',
                    message: 'Account Deleted!',
                })

            } catch (e) {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem deleting the account, please try again later.',
                    e
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

module.exports = AccountController
