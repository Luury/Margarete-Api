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

        var investment = transactions.filter((transaction) => transaction.type == 3);

        investment = investment.map((transaction) => {
            return transaction.value;
        })

        const investmentAmount = investment.length;

        if (investment.length === 0) {
            investment = 0.00
        } else {
            investment = investment.reduce((total, currentElement) => total + currentElement)
        }

        const balanceAmount = revenueAmount + expenseAmount + investmentAmount
        var balance = revenue - expense - investment;

        return response.json({
            balance,
            expense,
            revenue,
            investment,
            balanceAmount,
            revenueAmount,
            expenseAmount,
            investmentAmount,
        })
    }

    async transactions({ auth, response }) {

        const user = auth.current.user

        const transactions = await user.transactions().fetch()

        return transactions;
    }

    async accounts({ auth, response }) {

        const user = auth.current.user

        const accounts = await user.accounts().fetch()

        return accounts;
    }
}

module.exports = HomeController
