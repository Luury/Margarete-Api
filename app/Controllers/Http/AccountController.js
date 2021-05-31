'use strict'

const Account = use('App/Models/Account');
const User = use('App/Models/User');

class AccountController {
    async index({ auth }) {
        const id = auth.current.user.id

        const user = await User.find(id)

        const accounts = await user.accounts().fetch()

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
            balance: request.input('balance'),
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
