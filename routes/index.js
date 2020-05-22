const express = require('express')
const router = express.Router()
const { query, validationResult } = require('express-validator')
const peopleCtrl = require('../controllers/peopleCtrl')
const planetsCtrl = require('../controllers/planetsCtrl')

router.get('/', (req, res, next) => res.send('Hello World!'))

router.get('/people', [
  query('sortBy', 'not a valid sortBy query parameter').optional().isString().bail().isIn(['name', 'height', 'mass'])
], (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  return peopleCtrl(req, res)
})

router.get('/planets', (req, res, next) => {
  return planetsCtrl(req, res)
})

module.exports = router
