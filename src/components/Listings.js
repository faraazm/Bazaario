import { useState, useEffect } from 'react'
import { Grid, Col, Pagination, Text } from '@mantine/core'
import Listing from './Listing'
import { useHistory } from 'react-router-dom'

const Listings = ({ listings, itemsPerPage }) => {
  const [activePage, setPage] = useState(1)
  const [startIndex, setStartIndex] = useState(
    activePage * itemsPerPage - itemsPerPage,
  )
  const [endIndex, setEndIndex] = useState(activePage * itemsPerPage)

  const history = useHistory()

  useEffect(() => {
    setPage(1)
    setStartIndex(0)
    setEndIndex(itemsPerPage)
  }, [listings, itemsPerPage])

  const updatePage = (page) => {
    setPage(page)
    setStartIndex(page * itemsPerPage - itemsPerPage)
    setEndIndex(page * itemsPerPage)
  }

  return (
    <>
      <Grid align="center">
        {listings.length > itemsPerPage ? (
          <Col span={12}>
            <Pagination
              total={Math.ceil(listings.length / itemsPerPage)}
              color="teal"
              page={activePage}
              onChange={updatePage}
            />
          </Col>
        ) : (
          <></>
        )}

        {listings.length ? (
          listings.slice(startIndex, endIndex).map((listing) => {
            return (
              <Col
                key={listing.id}
                onClick={() => history.push(`/listing/${listing.id}`)}
                span={12}
                sm={4}
                md={4}
                lg={4}
              >
                <Listing listing={listing} />
              </Col>
            )
          })
        ) : (
          <Col span={12}>
            {/* Research better way to do this */}
            <Text mb="sm">Uh oh! No listings here</Text>
          </Col>
        )}

        {listings.length > itemsPerPage ? (
          <Col span={12}>
            <Pagination
              total={Math.ceil(listings.length / itemsPerPage)}
              color="teal"
              page={activePage}
              onChange={updatePage}
            />
          </Col>
        ) : (
          <></>
        )}
      </Grid>
    </>
  )
}

export default Listings
