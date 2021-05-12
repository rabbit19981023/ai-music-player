import { Router } from 'express'
import musicPlayerController from '../controllers/musicPlayer.controller'

const router: Router = Router()

/** '/' Routes **/
router.get('/music-player', musicPlayerController.musicPlayer)

export default router
