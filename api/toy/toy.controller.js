import { toyService } from './toys.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getToys(req, res) {
  try {
    const queryOptions = {
      filterBy: {
        txt: req.query.txt || '',
        price: +req.query.price || 0,
        inStock: req.query.inStock || '',
        labels: [].concat(req.query.labels || []),
      },
      sortBy: {
        sortField: req.query.sortField || 'name',
        sortDir: +req.query.sortDir || 1,
      },
    }
    const toys = await toyService.query(queryOptions)
    res.json(toys)
  } catch (err) {
    loggerService.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

export async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    loggerService.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

export async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const deletedCount = await toyService.remove(toyId)
    res.send(`${deletedCount} toys removed`)
  } catch (err) {
    loggerService.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

export async function addToy(req, res) {
  // const { loggedinUser } = req

  try {
    const toy = {
      name: req.body.name,
      price: +req.body.price,
      imgUrl:
        req.body.imgUrl ||
        'https://image.tmdb.org/t/p/original/pHa3BYewe7XDHRXIouXG2Vv1FJl.jpg',
      labels: [],
      createdAt: Date.now(),
      inStock: true,
    }
    // toy.owner = loggedinUser
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    loggerService.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

export async function updateToy(req, res) {
  try {
    const toy = { ...req.body, _id: req.params.id }
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)
  } catch (err) {
    loggerService.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

// export async function getToys(req, res) {
//   try {
//     const queryOptions = {
//       filterBy: {
//         txt: req.query.txt || '',
//         price: +req.query.price || 0,
//         inStock: req.query.inStock || '',
//         labels: [].concat(req.query.labels || []),
//       },
//       sortBy: {
//         sortField: req.query.sortField || 'name',
//         sortDir: +req.query.sortDir || 1,
//       },
//     }
//     const toys = await toyService.query(queryOptions)
//     res.send(toys)
//   } catch (err) {
//     loggerService.error('Cannot get toys', err)
//     res.status(500).send({ err: 'Failed to get toys' })
//   }
// }

// export async function getToyById(req, res) {
//   try {
//     const { toyId } = req.params

//     const toy = await toyService.getById(toyId)
//     res.send(toy)
//   } catch (err) {
//     loggerService.error('Cannot get toy', err)
//     res.status(500).send('Cannot get toy')
//   }
// }

// export async function addToy(req, res) {
//   try {
//     const toy = {
//       name: req.body.name,
//       price: +req.body.price,
//       imgUrl:
//         req.body.imgUrl ||
//         'https://image.tmdb.org/t/p/original/pHa3BYewe7XDHRXIouXG2Vv1FJl.jpg',
//       labels: [],
//       createdAt: Date.now(),
//       inStock: true,
//     }
//     const savedToy = await toyService.save(toy)
//     res.send(savedToy)
//   } catch (err) {
//     loggerService.error('Cannot save toy', err)
//     res.status(500).send('Cannot save toy')
//   }
// }

// export async function updateToy(req, res) {
//   try {
//     const toy = {
//       _id: req.params.id,
//       name: req.body.name,
//       price: +req.body.price,
//       imgUrl: req.body.imgUrl,
//     }

//     const savedToy = await toyService.save(toy)
//     res.send(savedToy)
//   } catch (err) {
//     loggerService.error('Cannot save toy', err)
//     res.status(500).send('Cannot save toy')
//   }
// }

// export async function removeToy(req, res) {
//   try {
//     const { toyId } = req.params
//     toyService.remove(toyId)
//     res.send('Removed!')
//   } catch (err) {
//     loggerService.error('Cannot remove toy', err)
//     res.status(500).send('Cannot remove toy')
//   }
// }
