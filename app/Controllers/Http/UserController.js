'use strict'

const User = use("App/Models/User");

class UserController {

    async create({ request, auth, response }) {
        // get user data from signup form
        const userData = request.only(['username', 'email', 'cpf', 'password'])
        try {
            // save user to database
            const user = await User.create(userData)
            // generate JWT token for user
            const token = await auth.generate(user)

            return response.json({
                status: 'success',
                token: token.token,
                type: token.type,
                refreshToken: token.refreshToken
            })
        } catch (error) {
            return response.status(400).json({
                status: 'error',
                message: 'There was a problem creating the user, please try again later.'
            })
        }
    }

    async auth({ request, auth, response }) {
        try {
            // validate the user credentials and generate a JWT token
            const token = await auth.attempt(
                request.input('email'),
                request.input('password')
            )

            return response.json({
                status: 'success',
                token: token.token,
                type: token.type,
                refreshToken: token.refreshToken
            })

        } catch (error) {
            response.status(400).json({
                status: 'error',
                message: 'Invalid email/password'
            })
        }
    }

    async info({ auth, response }) {
        const user = auth.current.user

        return response.json({
            id: user.id,
            username: user.username,
            cpf: user.cpf,
            email: user.email
        })

    }

}

module.exports = UserController
