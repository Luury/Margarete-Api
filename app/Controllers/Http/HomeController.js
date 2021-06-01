'use strict'

const User = use('App/Models/User');
const Transaction = use('App/Models/Transaction');
const Account = use('App/Models/Account');

class HomeController {


    async index({ auth, response }) {

        const user = auth.current.user

        var transactions = await user.transactions().fetch()
        transactions = transactions.rows

        var expense = transactions.filter((transaction) => transaction.type == 1);

        expense = expense.map((transaction) => {
            return transaction.value;
        })

        const expenseAmount = expense.length;

        if (expense.length === 0) {
            expense = 0.00
        } else {
            expense = expense.reduce((total, currentElement) => total + currentElement)
        }

        var revenue = transactions.filter((transaction) => transaction.type == 2);

        revenue = revenue.map((transaction) => {
            return transaction.value;
        })

        const revenueAmount = revenue.length

        if (revenue.length === 0) {
            revenue = 0.00
        } else {
            revenue = revenue.reduce((total, currentElement) => total + currentElement)
        }

        const balanceAmount = revenueAmount + expenseAmount
        var balance = revenue - expense;

        return response.json({
            balance,
            expense,
            revenue,
            balanceAmount,
            revenueAmount,
            expenseAmount,
        })
    }

    async transactions({ auth, response }) {

        const transactions = await Transaction.query().with('accounts').fetch();

        return transactions;
    }

    async accounts({ auth, response }) {

        const accounts = await Account.query().with('transactions').fetch();

        return accounts;
    }
}

module.exports = HomeController
