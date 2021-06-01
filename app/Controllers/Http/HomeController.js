'use strict'

const User = use('App/Models/User');
const Transaction = use('App/Models/Transaction');
const Account = use('App/Models/Account');

class HomeController {


    async index({ auth, response }) {

        const user = auth.current.user

        var transactions = await user.transactions().fetch()
        transactions = transactions.rows

        var accounts = await user.accounts().fetch()
        accounts = accounts.rows

        var despesa = transactions.filter((transaction) => transaction.type == 1);

        despesa = despesa.map((transaction) => {
            return transaction.value;
        })

        const despesaAmount = despesa.length;

        if (despesa.length === 0) {
            despesa = 0.00
        } else {
            despesa = despesa.reduce((total, currentElement) => total + currentElement)
        }

        var receita = transactions.filter((transaction) => transaction.type == 2);

        receita = receita.map((transaction) => {
            return transaction.value;
        })

        const receitaAmount = receita.length

        if (receita.length === 0) {
            receita = 0.00
        } else {
            receita = receita.reduce((total, currentElement) => total + currentElement)
        }

        const geralAmount = receitaAmount + despesaAmount
        var geral = receita - despesa;

        return response.json({
            geral,
            despesa,
            receita,
            geralAmount,
            receitaAmount,
            despesaAmount,
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
