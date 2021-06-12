'use strict'

const Category = use('App/Models/Category');

class CategoryController {

    async index({ auth }) {
        const user = auth.current.user

        const categories = await user.categories().fetch()

        return categories;
    }listByType

    async indexByType({ auth, params}) {
        const user = auth.current.user

        var categories = await user.categories().fetch()

        categories = categories.rows

        categories = categories.filter((category) => category.type == params.id);

        return categories;
    }

    async category({ auth, response, params }) {

        const category = await Category.find(params.id)

        if (auth.current.user.id == category.user_id) {
            try {
                return category
            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem geting category, please try again later.'
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
        const category = await Category.create({
            user_id: user.id,
            type: request.input('type'),
            description: request.input('description'),
            icon_id: request.input('icon_id'),
        })

        return response.json({
            status: 'success',
            message: 'Category Created!',
            data: category
        })
    }

    async update({ request, auth, response, params }) {

        const category = await Category.find(params.id)

        if (auth.current.user.id == category.user_id) {
            try {
                category.type = request.input('type')
                category.description = request.input('description')
                category.icon_id = request.input('icon_id')

                await category.save()

                return response.json({
                    status: 'success',
                    message: 'Category Updated!',
                    data: category
                })

            } catch {
                return response.status(400).json({
                    status: 'error',
                    message: 'There was a problem updating the category, please try again later.'
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
        const category = await Category.find(params.id)

        if (auth.current.user.id == category.user_id) {
            try {

                await category.delete()

                return response.json({
                    status: 'success',
                    message: 'Category Deleted!',
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


module.exports = CategoryController
