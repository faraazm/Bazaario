import { useState, useEffect } from 'react'
import { useForm } from '@mantine/hooks'
import {
  Text,
  TextInput,
  Textarea,
  Button,
  Select,
  Image,
  Space,
} from '@mantine/core'
import { useHistory } from 'react-router-dom'
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai'

import DropZone from './DropZone'
import FormattedCurrencyInput from './FormattedCurrencyInput'
import { getCategories, createListing } from '../helpers/listings'
import { useAuth } from '../auth'
import { useNotifications } from '@mantine/notifications'

const CreateListingForm = ({ setCreateModalOpen, uid }) => {
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState('')
  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const notifications = useNotifications()
  
  const history = useHistory()
  const auth = useAuth()
  const user = auth.user

  useEffect(() => {
    ;(async () => setCategories(await getCategories()))()
    return () => setCategories([])
  }, [])

  const form = useForm({
    initialValues: {
      category: '',
      name: '',
      description: '',
      price: 0.0,
    },

    validationRules: {
      category: (value) => value.length > 0,
      name: (value) => value.length > 0,
      description: (value) => value.length > 0,
      price: (value) => value <= parseFloat(1000000),
    },
  })

  const submit = async () => {
    setSubmitting(true)
    const listingCreated = await createListing({
      ...form.values,
      images,
      thumbnail,
      uid,
      email: user.email
    })

    if (listingCreated) {
      setCreateModalOpen(false)
      notifications.showNotification({
        title: 'Success!',
        message: 'Your listing was created',
        icon: <AiOutlineCheck />,
        color: 'green',
      })
      history.push(`listing/${listingCreated.id}`)
    } else {
      setCreateModalOpen(false)
      notifications.showNotification({
        title: 'Oops!',
        message:
          'There was a problem fulfilling your request. Please try again later',
        icon: <AiOutlineClose />,
        color: 'red',
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit(() => submit())}>
      <Select
        label="Category"
        placeholder="Category"
        mb="sm"
        error={form.errors.category && 'Please select a category'}
        value={form.values.category}
        onChange={(value) => form.setFieldValue('category', value)}
        data={categories}
        disabled={submitting}
        required
      />

      <TextInput
        required
        label="Name"
        placeholder="Name"
        mb="sm"
        maxLength={50}
        error={form.errors.name && 'Please enter a name'}
        value={form.values.name}
        onChange={(event) =>
          form.setFieldValue('name', event.currentTarget.value)
        }
        disabled={submitting}
      />

      <Textarea
        label="Description"
        placeholder="Description"
        required
        mb="sm"
        maxLength={1000}
        error={form.errors.description && 'Please enter a description'}
        value={form.values.description}
        onChange={(event) =>
          form.setFieldValue('description', event.currentTarget.value)
        }
        disabled={submitting}
      />

      <Text style={{ marginBottom: 5 }} size="sm" weight={500}>
        Price
      </Text>
      <FormattedCurrencyInput
        setPrice={form.setFieldValue}
        disabled={submitting}
      />
      <Space h="md" />

      {images.length ? (
        <div>
          <Text size="sm" weight={500} mb="xs">
            Select thumbnail:
          </Text>
          <div style={{ display: 'flex' }}>
            {images.map((image) => (
              <div key={image.path}>
                <Text
                  size="sm"
                  mb="xs"
                  weight={thumbnail === image.name ? 700 : ''}
                >
                  {image.name}
                </Text>
                <Image
                  height={80}
                  width={80}
                  mr={10}
                  radius="md"
                  style={{
                    border: thumbnail === image.name ? '3px solid #32a87b' : '',
                    borderRadius: 15,
                  }}
                  onClick={() => setThumbnail(image.name)}
                  src={URL.createObjectURL(image)}
                ></Image>
              </div>
            ))}
          </div>
          <Button
            mt="sm"
            variant="outline"
            color="red"
            rightIcon={<AiOutlineClose size={14} />}
            onClick={() => setImages([])}
            disabled={submitting}
          >
            Remove Images
          </Button>
        </div>
      ) : (
        <DropZone setImages={setImages} />
      )}

      <Button color="dark" mt="sm" type="submit" loading={submitting} disabled={!images.length}>
        {submitting ? 'Creating your listing...' : 'Submit'}
      </Button>
    </form>
  )
}

export default CreateListingForm
