'use strict'

const fetchAllSwapi = require('../utils/fetchAllSwapi')

const toInt = (string) => {
  return parseInt(string.replace(/,/g, ''), 10) || 0
}

const peopleCtrl = async function (req, res) {
  try {
    const allPeople = await fetchAllSwapi('/people')

    // Do sorting
    const sortBy = req.query.sortBy
    if (sortBy === 'height') {
      allPeople.sort((a, b) => {
        const aH = toInt(a.height)
        const bH = toInt(b.height)
        return aH - bH
      })
    }
    else if (sortBy === 'mass') {
      allPeople.sort((a, b) => {
        const aM = toInt(a.mass)
        const bM = toInt(b.mass)
        return aM - bM
      })
    }
    else {
      allPeople.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      })
    }

    res.json(allPeople)
  }
  catch (error) {
    return res.status(500).send()
  }
}

module.exports = peopleCtrl
