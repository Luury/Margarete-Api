'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/user/create', "UserController.create");

Route.post('/user/auth', "UserController.auth");

Route.get('/home', "HomeController.index").middleware(['auth']);

Route.get('/transaction', "TransactionController.index").middleware(['auth']);
Route.post('/transaction/create', "TransactionController.create").middleware(['auth']);
Route.put('/transaction/update/:id', "TransactionController.update").middleware(['auth']);
Route.delete('/transaction/delete/:id', "TransactionController.delete").middleware(['auth']);

