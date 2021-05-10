import { Router } from 'express'
import apiController from '../controllers/api.controller'

const router: Router = Router()

/** /v1/api/ Routes **/
router.get('/types/all', apiController.allTypes)
router.get('/types-with-imgs/all', apiController.typesWithImgs)
router.get('/tones/all', apiController.allTones)

router.post('/songs', apiController.addSong)

export default router
