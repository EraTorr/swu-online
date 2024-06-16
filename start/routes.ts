/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home', { version: 6 })

const UsersController = () => import('#controllers/games_controller')
router.get('game', [UsersController, 'board'])
router.get('pregame', [UsersController, 'pregame'])
router.get('matchmaking', [UsersController, 'matchmaking'])

const DeckValidateController = () => import('#controllers/api/deck_validate_controller')
router.post('api/deck-validate', [DeckValidateController, 'index'])
