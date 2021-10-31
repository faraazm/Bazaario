import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Group, Text, useMantineTheme } from '@mantine/core'
import {
  AiOutlineFileImage,
  AiOutlineUpload,
  AiOutlineCloseCircle,
} from 'react-icons/ai'

function ImageUploadIcon({ status, ...props }) {
  if (status.accepted) {
    return <AiOutlineUpload {...props} />
  }

  if (status.rejected) {
    return <AiOutlineCloseCircle {...props} />
  }

  return <AiOutlineFileImage {...props} />
}

function getIconColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.black
}

const DropZone = ({ setImages }) => {
  const theme = useMantineTheme()

  return (
    // See results in console after dropping files to Dropzone
    <Dropzone
      onDrop={(files) => {
          if(files.length > 3) {
            alert('You can only upload upto 3 files')
            return false
          }
          setImages(files);
      }}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
    >
      {(status) => (
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 220, pointerEvents: 'none' }}
        >
          <ImageUploadIcon
            status={status}
            style={{
              width: 80,
              height: 80,
              color: getIconColor(status, theme),
            }}
          />

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach upto threee files, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      )}
    </Dropzone>
  )
}

export default DropZone
