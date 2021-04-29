import { Router } from 'express'
import uploadController from '../controllers/upload.controller'

const router: Router = Router()

/** /upload/ Routes **/
router.get('/add-train-data', uploadController.addTrainData)

export default router
