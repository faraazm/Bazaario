import { useState, useEffect } from 'react'
import { Text, Button } from '@mantine/core'
import { getUserListings } from '../helpers/listings'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useAuth } from '../auth'
import Listings from './Listings'
import { useHistory } from 'react-router-dom'
import { SkeletonLoaders } from './SkeletonLoader'

const MyListings = () => {
  const [listings, setListings] = useState([])
  const [isRequestCompleted, setIsRequestCompleted] = useState(false)
  const [page,] = useState(1)

  const auth = useAuth()
  const user = auth.user
  const history = useHistory()

  useEffect(() => {
    ;(async () => {
      setTimeout(async () => {
        const response = await getUserListings(user.uid)
        setListings(response)
        if(response) {
          setIsRequestCompleted(true)
        }
      }, 1000)
    })()
  }, [user.uid, isRequestCompleted])

  return (
    <>
      <div style={{ marginBottom: 30 }}>
        <Button
          variant="outline"
          color="dark"
          mr="sm"
          mb="sm"
          leftIcon={<AiOutlineArrowLeft size={14} />}
          onClick={() => history.push('/dashboard')}
        >
          Go to Homepage
        </Button>
      </div>

      <Text size="xl" mb="md" weight={700}>
        My Listings 🏷️
      </Text>
      {
        isRequestCompleted ?
        <Listings listings={listings} itemsPerPage={12} activePage={page} /> :
        SkeletonLoaders(9)
      }
    </>
  )
}

export default MyListings
