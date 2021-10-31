import { useState } from 'react'
import { useAuth, useProvideAuth } from '../auth'
import { GoogleButton } from 'react-google-button'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from '@mantine/hooks'
import { MdSell } from 'react-icons/md'
import {
  TextInput,
  Button,
  PasswordInput,
  Space,
  Center,
  Notification,
  Text,
  Paper,
  Anchor,
} from '@mantine/core'

const Login = () => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => value.length > 0,
    },
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const auth = useProvideAuth()
  const history = useHistory()

  const submit = async () => {
    setLoading(true)
    const { email, password } = form.values

    const user = await auth.signIn(email, password)
    user ? history.push('/dashboard') : history.push('/')

    if (user) {
      setError(false)
      history.push('/dashboard')
    } else {
      history.push('/')
      setError(true)
    }

    // Slightly delayed to make transition smoother
    setLoading(false)
  }

  return (
    <div className="center">
      <Paper padding="lg" shadow="md" className="login-form-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MdSell style={{ fontSize: 50, marginRight: '10px' }} />
          <Text style={{ fontSize: 50 }} weight={700} align="center">
            bazaario
          </Text>
        </div>

        {error && (
          <Notification title="Login Error" mt="md" mb="md" color="red">
            Incorrect login information provided. Please try again.
          </Notification>
        )}
        <form onSubmit={form.onSubmit(() => submit())}>
          <TextInput
            label="Email"
            radius="xs"
            size="md"
            placeholder="Email"
            autoComplete="off"
            disabled={loading}
            error={form.errors.email && 'Please specify a valid email'}
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
          />
          <Space h="sm" />
          <div>
            <PasswordInput
              placeholder="Password"
              label="Password"
              radius="xs"
              size="md"
              autoComplete="new-password"
              disabled={loading}
              error={form.errors.password && 'Please enter your password'}
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue('password', event.currentTarget.value)
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
            {loading ? 'Logging In' : 'Login'}
          </Button>
        </form>
        <Space h="xs" />
        <AuthButton />
        <Space h="sm" />
        <Center>
          <Anchor component={Link} to="register" color="dark">
            New user? Create Account here
          </Anchor>
        </Center>
      </Paper>
    </div>
  )
}

function AuthButton() {
  let auth = useAuth()
  return auth.user ? (
    <button onClick={() => auth.logOut()}>Logout</button>
  ) : (
    <GoogleButton
      style={{
        width: '100%',
        backgroundColor: '#228BE6',
        fontFamily: 'Poppins',
        boxShadow: 'none',
      }}
      onClick={() => auth.signInWithGoogle()}
    ></GoogleButton>
  )
}

export default Login
