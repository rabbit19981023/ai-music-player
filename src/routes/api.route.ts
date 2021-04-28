import { Router } from 'express'
import apiController from '../controllers/api.controller'

const router: Router = Router()

/** /v1/api/ Routes **/
router.get('/types/all', apiController.typesAll)

export default router
