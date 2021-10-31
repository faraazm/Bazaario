import { Text, Image, Card } from '@mantine/core'

const Listing = ({ listing }) => {
  return (
    <Card shadow="lg" style={{ minHeight: 275 }} className="listing hover-pointer">
      <Card.Section>
        <Image
          src={
            listing.thumbnail
              ? listing.thumbnail
              : 'https://via.placeholder.com/150'
          }
          height={160}
          withPlaceholder
          alt="Image"
        />
      </Card.Section>

      <div>
        <Text size="md" weight={500} mt="md" mb={0}>
          {listing.name}
        </Text>
        <Text size="md" mt="xs" weight={700} color="green">
          ${listing.price}
        </Text>
      </div>
    </Card>
  )
}

export default Listing
