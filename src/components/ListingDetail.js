import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getListingDetails,
  getImages,
  removeListing,
} from '../helpers/listings'
import { Grid, Col, Text, Button, Modal, Center, Badge } from '@mantine/core'
import { useHistory } from 'react-router-dom'
import {
  AiOutlineArrowLeft,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineSearch
} from 'react-icons/ai'
import Slider from './Slider'
import { ImageLoader, TextLoader } from './SkeletonLoader'
import { useAuth } from '../auth'
import { useNotifications } from '@mantine/notifications'

const ListingDetail = () => {
  const [listing, setListing] = useState(null)
  const [images, setImages] = useState([])
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  const auth = useAuth()
  const user = auth.user
  const history = useHistory()
  const notifications = useNotifications()

  const { id } = useParams()

  const remove = () => {
    removeListing(id)
    notifications.showNotification({
      title: 'Success!',
      message: 'Your listing was deleted',
      icon: <AiOutlineCheck />,
      color: 'green',
    })
    history.push('/dashboard')
  }

  useEffect(() => {
    ;(async () => {
      setTimeout(async () => setListing(await getListingDetails(id)), 1000)
      setTimeout(async () => setImages(await getImages(id)), 1000)
    })()
  }, [id])

  return (
    <>
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Are you sure you want to delete this listing?"
      >
        <Center>
          <Button onClick={() => remove()} color="red" mr="xs">
            Yes, I'm sure 👍
          </Button>
          <Button
            onClick={() => setDeleteModalOpened(false)}
            variant="outline"
            color="gray"
          >
            Nevermind ✋
          </Button>
        </Center>
      </Modal>
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
      <Button
        variant="outline"
        color="dark"
        mr="sm"
        leftIcon={<AiOutlineSearch size={14} />}
        onClick={() => history.push('/my-listings')}
      >
        View My Listings
      </Button>
      {listing && user.uid === listing.uid && (
        <Button
          color="red"
          leftIcon={<AiOutlineDelete size={14} />}
          onClick={() => setDeleteModalOpened(true)}
        >
          Delete Listing
        </Button>
      )}

      <Grid mt="xl">
        <Col span={12} md={6}>
          {images.length ? <Slider images={images} /> : <ImageLoader />}
        </Col>

        <Col span={12} md={6}>
          {listing && images.length ? (
            <>
              <Text size="xl" mb="xs" weight={700}>
                {listing.name}
              </Text>
              <Badge variant="outline" color="teal" mb="xs">
                {listing.email ? listing.email : 'No email provided'}
              </Badge>
              <Text mb="sm" size="xl" color="teal">
                ${listing.price}
              </Text>
              <Text size="sm" mb="sm">
                {listing.description}
              </Text>
            </>
          ) : (
            <TextLoader />
          )}
        </Col>
      </Grid>
    </>
  )
}

export default ListingDetail
