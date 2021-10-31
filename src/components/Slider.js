import { useState } from 'react'
import { Image, Grid, Col } from '@mantine/core'

const Slider = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <Grid>
      {images.length && selectedImage ? (
        <Col span={12}>
          <Image height={400} radius="lg" withPlaceholder src={selectedImage} />
        </Col>
      ) : (
        <></>
      )}

      {images.length ? (
        images.map((image) => {
          return (
            <Col key={image} span={4} md={4} lg={3}>
              <Image
                radius="lg"
                withPlaceholder
                src={image}
                height={100}
                width={'100%'}
                onClick={() => setSelectedImage(image)}
              />
            </Col>
          )
        })
      ) : (
        <>No images available</>
      )}
    </Grid>
  )
}

export default Slider
