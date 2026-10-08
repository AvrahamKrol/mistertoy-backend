import fs from 'fs'
import { utilService } from './util.service.js'

export const toyService = {
  query,
  getById,
  remove,
  save,
}

// const PAGE_SIZE = 5
let toys = utilService.readJsonFile('data/toy.json') || []
getById('CPNkf')

function query(filterBy = { txt: '' }) {
  if (!toys || toys.length < 1) {
    for (var i = 0; i < 3; i++) {
      toys.push(_createToy())
    }
    _saveToysToFile()
  }

  const regex = new RegExp(filterBy.txt, 'i')
  var toysToReturn = toys.filter((toy) => regex.test(toy.name))

  if (filterBy.minPrice) {
    toysToReturn = toysToReturn.filter((toy) => toy.price >= filterBy.minPrice)
  }
  // if (filterBy.maxPrice) {
  //   toysToReturn = toysToReturn.filter((toy) => toy.price <= filterBy.maxPrice)
  // }

  // if (filterBy.pageIdx !== undefined) {
  //   const startIdx = filterBy.pageIdx * PAGE_SIZE
  //   toysToReturn = toysToReturn.slice(startIdx, startIdx + PAGE_SIZE)
  // }
  return Promise.resolve(toysToReturn)
}

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject('No Such Car')

  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy, loggedinUser) {
  if (toy._id) {
    const toyToUpdate = toys.find((currCar) => currCar._id === toy._id)

    toyToUpdate.name = toy.name
    toyToUpdate.price = toy.price
    toy = toyToUpdate
  } else {
    toy._id = utilService.makeId()
    toys.unshift(toy)
  }
  return _saveToysToFile().then(() => toy)
}

function _createToy() {
  const toy = {
    _id: utilService.makeId(),
    name: 'Talking Doll',
    imgUrl:
      'https://image.tmdb.org/t/p/original/pHa3BYewe7XDHRXIouXG2Vv1FJl.jpg',
    price: 123,
    labels: ['Doll', 'Battery Powered', 'Baby'],
    createdAt: Date.now(),
    inStock: true,
  }
  return toy
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 2)
    fs.writeFile('data/toy.json', data, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
