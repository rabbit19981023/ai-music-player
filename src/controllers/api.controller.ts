import { Request, Response } from 'express'
import fetch from 'node-fetch'

export default {
  // GET '/v1/api/types/all'
  typesAll: async function (req: Request, res: Response) {
    try {
      const typesResponse = await fetch('http://163.18.42.232:8000/get_types')
      const types = await typesResponse.json()
      // const typeImgs = (await fetch('http://163.18.42.232:8000/types_img')).json()

      const data = types

      res.json(data)
    } catch (err) {
      res.json({ status: 500 })
    }
  }
}
