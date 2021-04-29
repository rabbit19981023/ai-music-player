import { Request, Response } from 'express'
import fetch from 'node-fetch'

export default {
  // GET '/v1/api/types/all'
  allTypes: async function (req: Request, res: Response) {
    try {
      const result = await fetch('http://163.18.42.232:8000/get_types')
      const types: JSON = await result.json()

      return res.json(types)
    } catch (err) { return res.json({ status: 500 })}
  },

  // GET '/v1/api/types-with-imgs/all'
  typesWithImgs: async function (req: Request, res: Response) {
    try {
      const result = await fetch('http://163.18.42.232:8000/types_img')
      const typesWithImgs: JSON = await result.json()

      return res.json(typesWithImgs)
    } catch (err) {return res.json({ status: 500 })}
  }
}
