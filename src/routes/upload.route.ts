import { Router } from 'express'
import uploadController from '../controllers/upload.controller'

const router: Router = Router()

/** '/' Routes **/
router.get('/add-train-data', uploadController.addTrainData)
router.get('/add-music', uploadController.addMusic)
router.get('/change-music-data', uploadController.changeMusicData)

export default router
