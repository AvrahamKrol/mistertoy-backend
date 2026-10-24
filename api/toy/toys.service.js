import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

let toys = utilService.readJsonFile('data/toy.json') || []

export const toyService = {
  remove,
  query,
  getById,
  save,
}

async function query(queryOptions) {
  const { filterBy, sortBy } = queryOptions
  if (!toys || toys.length < 1) {
    for (var i = 0; i < 3; i++) {
      toys.push(_createToy())
    }
    _saveToysToFile()
  }

  const regex = new RegExp(filterBy.txt, 'i')
  try {
    var toysToReturn = await toys.filter((toy) => regex.test(toy.name))

    if (filterBy.price) {
      toysToReturn = await toysToReturn.filter(
        (toy) => toy.price >= filterBy.price,
      )
    }

    if (filterBy.inStock) {
      const isInStock = filterBy.inStock === 'true'
      toysToReturn = await toysToReturn.filter(
        (toy) => toy.inStock === isInStock,
      )
    }

    if (filterBy.labels && filterBy.labels.length > 0) {
      toysToReturn = await toysToReturn.filter((toy) =>
        filterBy.labels.some((label) => (toy.labels || []).includes(label)),
      )
    }

    const { sortField, sortDir } = sortBy

    if (sortField === 'price' || sortField === 'createdAt') {
      toysToReturn.sort((t1, t2) => (t1[sortField] - t2[sortField]) * sortDir)
    } else if (sortField === 'inStock') {
      toysToReturn.sort(
        (t1, t2) => (Number(t2.inStock) - Number(t1.inStock)) * sortDir,
      )
    } else {
      toysToReturn.sort((t1, t2) => t1.name.localeCompare(t2.name) * sortDir)
    }
  } catch (err) {
    loggerService.error('cannot find toys', err)
    throw err
  }

  return Promise.resolve(toysToReturn)
}

async function getById(toyId) {
  try {
    const toy = await toys.find((toy) => toy._id === toyId)
    return Promise.resolve(toy)
  } catch (err) {
    loggerService.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const idx = await toys.findIndex((toy) => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')

    toys.splice(idx, 1)
    return _saveToysToFile()
  } catch (err) {
    loggerService.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function save(toy) {
  if (toy._id) {
    try {
      const toyToUpdate = await toys.find((currToy) => currToy._id === toy._id)

      toyToUpdate.name = toy.name
      toyToUpdate.price = toy.price
      toy = toyToUpdate
    } catch (err) {
      loggerService.error("couldn't update", err)
      throw err
    }
  } else {
    try {
      toy._id = utilService.makeId()
      toys.unshift(toy)
    } catch (err) {
      loggerService.error("couldn't save", err)
      throw err
    }
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
