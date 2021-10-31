import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { config } from '../firebase'
import * as geofirestore from 'geofirestore'
import {
  collection,
  getDoc,
  getDocs,
  query,
  doc,
  updateDoc,
  where,
  deleteDoc,
} from 'firebase/firestore'
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

firebase.initializeApp(config)

const firestore = firebase.firestore()
const GeoFirestore = geofirestore.initializeApp(firestore)
const geocollection = GeoFirestore.collection('listings')

const storage = getStorage()

export const uploadImages = async (files, listingId) => {
  await Promise.all(
    files.map(async (file) => {
      const storageRef = ref(storage, `${listingId}/${file.name}`)
      await uploadBytes(storageRef, file)
    }),
  )
}

const setThumbnail = async (listingId) => {
  const images = await listAll(ref(storage, `${listingId}/`))

  if (images.items.length) {
    const listingRef = doc(firestore, 'listings', listingId)
    const listingSnap = await getDoc(listingRef)
    const listing = listingSnap.data()
    // Set thumbnail to first item if no thumbnail was selected
    let thumbnailName =
      listing.thumbnail === '' ? images.items[0].name : listing.thumbnail
    // Get URL with thumbnail name
    const url = await getDownloadURL(
      ref(storage, `${listingId}/${thumbnailName}`),
    )
    // Update the url of the thumbnail
    await updateDoc(listingRef, {
      thumbnail: url,
    })
  }
}

export const getImages = async (listingId) => {
  const response = await listAll(ref(storage, `${listingId}/`))
  const images = await Promise.all(
    response.items.map(async (itemRef) => {
      const url = await getDownloadURL(
        ref(storage, `${listingId}/${itemRef.name}`),
      )
      return url
    }),
  )

  return images
}

// Create a new post reference with an auto-generated id
export const createListing = async (listing) => {
  const {
    category,
    name,
    description,
    price,
    images,
    thumbnail,
    uid,
    email,
  } = listing

  // Storing location in geoFire
  // const position = await getCurrentLocation()
  // const { latitude, longitude } = position.coords
  const latitude = getRandomLatitude()
  const longitude = getRandomLongitude()

  const listingCreated = await geocollection.add({
    uid,
    name,
    email,
    price: price === '' ? 0.0 : price,
    description,
    category,
    thumbnail,
    coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
  })

  await uploadImages(images, listingCreated.id)
  await setThumbnail(listingCreated.id)

  return listingCreated
}

export const getListings = async (setListings, distance) => {
  //Dummy one, which will result in a working next statement.
  navigator.geolocation.getCurrentPosition(
    function () {},
    function () {},
    {},
  )

  navigator.geolocation.getCurrentPosition(
    function (position) {
      let latitude = position.coords.latitude
      let longitude = position.coords.longitude

      console.log(latitude, longitude)

      if (distance) {
        const query = geocollection.near({
          center: new firebase.firestore.GeoPoint(latitude, longitude),
          radius: distance,
        })

        const subscription = query.onSnapshot((snapshot) => {
          const sortedListings = snapshot.docs.sort(
            (a, b) => a.distance - b.distance,
          )
          let listings = []

          sortedListings.forEach((doc) => {
            listings.push({ id: doc.id, ...doc.data() })
          })

          setListings(listings)
        })

        return subscription
      }
    },
    function (error) {
      console.log(error)
    },
    {
      enableHighAccuracy: true,
    },
  )
}

export const getListingDetails = async (listingId) => {
  const listingRef = doc(firestore, 'listings', listingId)
  const listingSnapshot = await getDoc(listingRef)

  if (listingSnapshot.exists()) {
    return listingSnapshot.data()
  } else {
    return false
  }
}

export const getUserListings = async (uid) => {
  let listings = []

  if (uid) {
    const q = query(collection(firestore, 'listings'), where('uid', '==', uid))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() })
    })

    return listings
  }
}

export const getCategories = async () => {
  const categoriesQuery = query(collection(firestore, 'categories'))
  const querySnapshot = await getDocs(categoriesQuery)
  let categories = []

  querySnapshot.forEach((doc) => {
    categories = doc.data().categories
  })

  return categories
}

export const removeListing = async (listingId) => {
  const imagesToDelete = await listAll(ref(storage, `${listingId}/`))

  imagesToDelete.items.map(async (image) => {
    const imageRef = ref(storage, `${listingId}/${image.name}`)
    await deleteObject(imageRef)
  })

  await deleteDoc(doc(firestore, 'listings', listingId))
}

export const searchListing = async (name, category, price) => {
  const listingRef = collection(firestore, 'listings')
  let q = query(listingRef)
  let wheres = []
  let listings = []

  if (name) {
    wheres.push(where('name', '==', name))
  }

  if (category) {
    wheres.push(where('category', '==', category))
  }

  if (price) {
    wheres.push(where('price', '==', price))
  }

  q = query(listingRef, ...wheres)

  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((doc) => {
    listings.push({ id: doc.id, ...doc.data() })
  })

  return listings
}

// function getCurrentLocation() {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject)
//   })
// }

function getRandomLongitude() {
  let num = (Math.random() * 180).toFixed(6)
  let positiveOrNegative = Math.floor(Math.random())
  if (positiveOrNegative === 0) {
    num = num * -1
  }
  return num
}

function getRandomLatitude() {
  let num = (Math.random() * 90).toFixed(6)
  let positiveOrNegative = Math.floor(Math.random())
  if (positiveOrNegative === 0) {
    num = num * -1
  }
  return num
}
