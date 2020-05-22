'use strict'

const axios = require('axios')
const fetchAllSwapi = require('../utils/fetchAllSwapi')

const planetsCtrl = async function (req, res) {
  try {
    const allPlanets = await fetchAllSwapi('/planets')

    const result = await Promise.all(allPlanets.map(async (planet) => {
      try {
        const residentsRsp = await Promise.all(
          planet.residents.map(async (i) => {
            return axios.get(i)
          })
        )

        const residents = residentsRsp.reduce((acc, cur) => {
          return [...acc, cur.data.name]
        }, [])

        return { ...planet, residents }
      }
      catch (error) {
        console.log(error)
      }
    }))

    res.json(result)
  }
  catch (error) {
    return res.status(500).send()
  }
}

module.exports = planetsCtrl
