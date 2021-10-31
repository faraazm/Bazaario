import { useState } from 'react'
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai'
import { useHistory } from 'react-router-dom'

// Helpers
import { useAuth } from '../auth'
import { getListings } from '../helpers/listings'
import { useDebouncedEffect } from '../helpers/useDebouncedEffect'

// Components
import CreateListingForm from './CreateListingForm'
import Listings from './Listings'
import { SkeletonLoaders } from './SkeletonLoader'
import SearchListing from './SearchListing'
import { Button, Text, Modal, Slider, Loader } from '@mantine/core'

const Dashboard = () => {
  const [listings, setListings] = useState([])
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [distance, setDistance] = useState(3000)

  const history = useHistory()

  const auth = useAuth()
  const user = auth.user

  useDebouncedEffect(
    async () => {
      setListings([])
      setTimeout(async () => await getListings(setListings, distance), 1000)
      return () => setListings([])
    },
    [distance],
    500,
  )

  return (
    <>
      <Modal
        title="List an item"
        size="lg"
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      >
        <CreateListingForm
          setCreateModalOpen={setCreateModalOpen}
          uid={user.uid}
        />
      </Modal>

      <div>
        <Text size="xl" weight={700} mb="sm">
          Welcome{user.displayName && `, ${user.displayName}`} 👋
        </Text>
        <Button
          color="dark"
          rightIcon={<AiOutlinePlus size={14} />}
          mr="sm"
          mb="sm"
          onClick={() => setCreateModalOpen(true)}
        >
          Create a Listing
        </Button>
        <Button
          variant="outline"
          color="dark"
          mb="sm"
          onClick={() => history.push('/my-listings')}
          rightIcon={<AiOutlineSearch size={14} />}
        >
          View My Listings
        </Button>
      </div>

      {listings.length ? (
        <>
          <Text size="xl" weight={700}>
            Listings {distance} kilometers from you 🏷️
          </Text>
          <Text mb="xl">Adjust the distance with the slider below</Text>
          <Slider
            labelAlwaysOn
            color="teal"
            label={(value) => `${value} Kilometers`}
            value={distance}
            onChange={setDistance}
            min={0}
            max={12756}
            step={500}
          />
          <SearchListing setListings={setListings} />
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text size="xl" weight={700}>
              Loading your listings
            </Text>
            <Loader ml="sm" color="teal" size="md" />
          </div>
          <Text mb="md">This should be quick...</Text>
        </>
      )}
      {listings.length ? (
        <Listings listings={listings} itemsPerPage={12} />
      ) : (
        SkeletonLoaders(9)
      )}
    </>
  )
}

export default Dashboard
