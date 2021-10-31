import { MdDone, MdClose } from 'react-icons/md'
import { Text } from '@mantine/core'

export function PasswordRequirement({ meets, label }) {
  return (
    <Text
      color={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center', marginTop: 7 }}
      size="sm"
    >
      {meets ? <MdDone /> : <MdClose />}{' '}
      <span style={{ marginLeft: 10 }}>{label}</span>
    </Text>
  )
}

export const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
]

export function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1
    }
  })

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10)
}

const passwordStrength = () => {
  return <div></div>
}

export default passwordStrength
