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

// User
Route.post('/user/create', "UserController.create");
Route.post('/user/auth', "UserController.auth");
Route.get('/user/info', "UserController.info").middleware(['auth']);

// Home
Route.get('/home', "HomeController.index").middleware(['auth']);
Route.get('/home/accounts', "HomeController.accounts").middleware(['auth']);
Route.get('/home/transactions', "HomeController.transactions").middleware(['auth']);

// Transactions 
Route.get('/transaction', "TransactionController.index").middleware(['auth']);
Route.get('/transaction/:id', "TransactionController.transaction").middleware(['auth']);
Route.post('/transaction/create', "TransactionController.create").middleware(['auth']);
Route.put('/transaction/update/:id', "TransactionController.update").middleware(['auth']);
Route.delete('/transaction/delete/:id', "TransactionController.delete").middleware(['auth']);

// Accounts
Route.get('/account', "AccountController.index").middleware(['auth']);
Route.get('/account/:id', "AccountController.account").middleware(['auth']);
Route.post('/account/create', "AccountController.create").middleware(['auth']);
Route.put('/account/update/:id', "AccountController.update").middleware(['auth']);
Route.delete('/account/delete/:id', "AccountController.delete").middleware(['auth']);

// Category
Route.get('/category', "CategoryController.index").middleware(['auth']);
Route.get('/category/type/:id', "CategoryController.indexByType").middleware(['auth']);
Route.get('/category/:id', "CategoryController.category").middleware(['auth']);
Route.post('/category/create', "CategoryController.create").middleware(['auth']);
Route.put('/category/update/:id', "CategoryController.update").middleware(['auth']);
Route.delete('/category/delete/:id', "CategoryController.delete").middleware(['auth']);

// Goals
Route.get('/goal', "GoalController.index").middleware(['auth']);
Route.get('/goal/:id', "GoalController.goal").middleware(['auth']);
Route.post('/goal/create', "GoalController.create").middleware(['auth']);
Route.put('/goal/update/:id', "GoalController.update").middleware(['auth']);
Route.delete('/goal/delete/:id', "GoalController.delete").middleware(['auth']);

//FAQ
Route.get('/faq', "FaqController.index");
