import ContentLoader from 'react-content-loader'
import { Col, Grid } from '@mantine/core'

export const ListingLoader = (props) => {
  return (
    <ContentLoader
      style={{ width: '100%' }}
      viewBox="0 0 290 200"
      backgroundColor="#f0f0f0"
      foregroundColor="#dedede"
      {...props}
    >
      <rect rx="5" ry="5" width="290" height="200" />
    </ContentLoader>
  )
}

export const ImageLoader = (props) => {
  return (
    <ContentLoader viewBox="0 0 400 500" height={570} width={500} {...props}>
      <rect rx="5" ry="5" width="400" height="300" />
      <rect y="310" rx="5" ry="5" width="90" height="90" />
      <rect y="310" x="100" rx="5" ry="5" width="90" height="90" />
      <rect y="310" x="200" rx="5" ry="5" width="90" height="90" />
    </ContentLoader>
  )
}

export const TextLoader = (props) => {
  return (
    <ContentLoader
      width={'100%'}
      viewBox="0 0 450 400"
      backgroundColor="#f0f0f0"
      foregroundColor="#dedede"
      {...props}
    >
      <rect rx="5" ry="5" width="400" height="15" />
      <rect y="30" rx="5" ry="5" width="200" height="30" />
      <rect y="70" rx="5" ry="5" width="400" height="70" />
      <rect y="150" rx="5" ry="5" width="150" height="40" />
    </ContentLoader>
  )
}

export const SkeletonLoaders = (number) => {
  let skeletons = []

  for (let i = 0; i < number; i++) {
    skeletons.push(
      <Col key={i} span={12} sm={4} md={4} lg={4}>
        <ListingLoader />
      </Col>
    )
  }

  return <Grid>{skeletons}</Grid>
}