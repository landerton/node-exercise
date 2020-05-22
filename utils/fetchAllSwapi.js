'use strict'

const config = require('config')
const axios = require('axios')

const getPageList = (totalCount, perPage) => {
  // create an array of all the pages we need
  const pages = []
  let count = totalCount - perPage
  let page = 2
  while (count > 0) {
    pages.push(page)
    page++
    count -= perPage
  }
  return pages
}

const fetchAllSwapi = async function (path) {
  try {
    // Get first page
    const uri = `${config.get('swapi.base_url')}${path}`
    const firstRsp = await axios.get(uri)

    const pages = getPageList(firstRsp.data.count, firstRsp.data.results.length)

    // Get the rest of the pages
    const remainingPages = await Promise.all(
      pages.map(async (i) => {
        return axios.get(`${uri}/?page=${i}`)
      })
    )

    // Combine results
    const all = remainingPages.reduce(
      (acc, cur) => {
        return [...acc, ...cur.data.results]
      },
      [...firstRsp.data.results]
    )

    return all
  }
  catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = fetchAllSwapi
