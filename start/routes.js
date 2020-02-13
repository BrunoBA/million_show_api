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

Route.get('/questions', 'QuestionController.index')
Route.post('/questions', 'QuestionController.store')
Route.get('/questions/:questionsHash', 'QuestionController.show')

Route.post('/users', 'UserController.store')
Route.get('/users', 'UserController.index')
