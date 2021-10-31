import { useState } from 'react'
import { useProvideAuth } from '../auth'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from '@mantine/hooks'
import {
  PasswordRequirement,
  requirements,
  getStrength,
} from '../helpers/passwordStrength'
import {
  TextInput,
  Button,
  PasswordInput,
  Space,
  Center,
  Notification,
  Text,
  Progress,
  Popover,
  Paper,
  Anchor,
} from '@mantine/core'

const Register = () => {
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [popoverOpened, setPopoverOpened] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => {
        if (!value.length) {
          setPasswordError('Please enter a password')
          return false
        } else if (value && strength !== 100) {
          setPasswordError('Your password is not strong enough.')
          return false
        }

        return true
      },
      confirmPassword: (value) => {
        if (value === '') {
          setConfirmPasswordError('Please confirm your password')
          return false
        } else if (value && value !== form.values.password) {
          setConfirmPasswordError('Please make sure your passwords match')
          return false
        }

        return true
      },
    },
  })

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ))

  const strength = getStrength(form.values.password)
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const auth = useProvideAuth()
  const history = useHistory()

  const submit = async () => {
    setLoading(true)
    const { email, password } = form.values

    const response = await auth.signUp(email, password)
    response.user ? history.push('/dashboard') : history.push('/register')

    if (response.user) {
      setError('')
      const signIn = await auth.signIn(email, password)
      signIn ? history.push('/dashboard') : history.push('/register')
    } else {
      setError(
        'Oops! There seems to be a problem registering you. Please try again later.',
      )
    }

    if (response.error.code === 'auth/email-already-in-use') {
      setError('This email is already in use. Please log in.')
    } else if (response.error.code === 'auth/weak-password') {
      setError('This password is hella weak bruh')
    } else {
      setError('')
    }

    // Slightly delayed to make transition smoother
    setLoading(false)
  }

  return (
    <div className="center">
      <Paper padding="lg" shadow="md" className="login-form-container">
        <Text style={{ fontSize: 50 }} weight={700} align="center">
          Register
        </Text>
        {error && (
          <Notification title="Registration Error" mt="md" mb="md" color="red">
            {error}
          </Notification>
        )}
        <form onSubmit={form.onSubmit(() => submit())}>
          <TextInput
            label="Email"
            radius="xs"
            size="md"
            placeholder="Email"
            autoComplete="off"
            required
            error={form.errors.email && 'Please specify a valid email'}
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
          />
          <Space h="sm" />
          <div style={{ width: '100%' }}>
            <Popover
              opened={popoverOpened}
              position="bottom"
              placement="start"
              withArrow
              style={{ width: '100%' }}
              styles={{ popover: { width: '100%' } }}
              noFocusTrap
              transition="pop-top-left"
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
              target={
                <PasswordInput
                  placeholder="Password"
                  label="Password"
                  radius="xs"
                  size="md"
                  required
                  autoComplete="new-password"
                  style={{ color: color }}
                  error={form.errors.password  && passwordError}
                  value={form.values.password}
                  onChange={(event) =>
                    form.setFieldValue('password', event.currentTarget.value)
                  }
                />
              }
            >
              <Progress
                color={color}
                value={strength}
                size={5}
                style={{ marginBottom: 10 }}
              />
              <PasswordRequirement
                label="Includes at least 6 characters"
                meets={form.values.password.length > 5}
              />
              {checks}
            </Popover>
          </div>
          <Space h="sm" />
          <div>
            <PasswordInput
              placeholder="Confirm Password"
              label="Confirm Password"
              radius="xs"
              size="md"
              required
              autoComplete="new-password"
              error={form.errors.confirmPassword && confirmPasswordError}
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue('confirmPassword', event.currentTarget.value)
              }
            />
          </div>
          <Space h="sm" />
          <Button
            color="dark"
            style={{ width: '100%' }}
            radius="xs"
            size="lg"
            type="submit"
            loading={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Space h="sm" />
        <Center>
          <Anchor component={Link} to="/" color="dark">
            Already have an account? Login here
          </Anchor>
        </Center>
      </Paper>
    </div>
  )
}

export default Register
