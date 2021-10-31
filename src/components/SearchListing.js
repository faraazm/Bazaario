import { useState, useEffect } from 'react'
import {
  Grid,
  Col,
  TextInput,
  Select,
  Text,
  Space,
  Button,
} from '@mantine/core'
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import { useForm } from '@mantine/hooks'
import FormattedCurrencyInput from './FormattedCurrencyInput'

import { getCategories, searchListing } from '../helpers/listings'
import { useNotifications } from '@mantine/notifications'

const SearchListing = ({ setListings }) => {
  const [categories, setCategories] = useState([])
  const [searching] = useState(false)

  const notifications = useNotifications()

  const form = useForm({
    initialValues: {
      category: '',
      name: '',
      price: 0.0,
    },
    validationRules: {
      price: (value) => {
        form.setFieldValue('price', 0.00)
      },
    },
  })

  const search = async () => {
    const listings = await searchListing(
      form.values.name,
      form.values.category,
      form.values.price,
    )

    if (listings.length) {
      setListings(listings)
    } else {
      notifications.showNotification({
        title: 'Oops!',
        message:
          "We couldn't find any listings that match your criteria. Try searching for something else!",
        icon: <AiOutlineClose />,
        color: 'red',
      })
    }
  }

  useEffect(() => {
    ;(async () => setCategories(await getCategories()))()
    return () => setCategories([])
  }, [])

  return (
    <>
      <Grid mt="md" mb="xl">
        <Col span={12} md={3}>
          <TextInput
            label="Name"
            placeholder="Name"
            maxLength={50}
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue('name', event.currentTarget.value)
            }
            disabled={searching}
          />
        </Col>
        <Col span={12} md={3}>
          <Select
            label="Category"
            placeholder="Category"
            value={form.values.category}
            onChange={(value) => form.setFieldValue('category', value)}
            data={categories}
            disabled={searching}
          />
        </Col>
        <Col span={12} md={3}>
          <Text style={{ marginBottom: 5 }} size="sm" weight={500}>
            Price
          </Text>
          <FormattedCurrencyInput
            setPrice={form.setFieldValue}
            disabled={searching}
          />
        </Col>
        <Col span={12} md={3}>
          <Space h="md" />
          <Button
            onClick={() => search()}
            color="teal"
            rightIcon={<AiOutlineSearch size={14} />}
            mr="sm"
          >
            Search
          </Button>
        </Col>
      </Grid>
    </>
  )
}

export default SearchListing
