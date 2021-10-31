import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

// Mantine
import { MantineProvider, Container, Loader, Text } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'

// Auth
import { ProvideAuth, PrivateRoute, PublicRoute } from './auth'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Components
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import MyListings from './components/MyListings'
import Navbar from './components/Navbar'
import ListingDetail from './components/ListingDetail'

import '@fontsource/poppins'
import './index.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      setLoading(false)
      setUser(user)
    })
  })

  return (
    <MantineProvider
      theme={{
        // Override any other properties from default theme
        fontFamily: 'Open Sans, sans-serif',
        fontSizes: {
          xl: 25
        },
        spacing: { xs: 10, sm: 20, md: 25, lg: 30, xl: 40 },
      }}
    >
      <NotificationsProvider>
        {loading ? (
          <div className="page-loader">
            <Text style={{ fontSize: 50 }} weight={700} align="center" mr="md">
              bazaario
            </Text>
            <Loader style={{ width: 50, height: 50 }} />
          </div>
        ) : (
          <Container>
            <ProvideAuth>
              <Router>
                {user ? (
                  <div className="navbar-container">
                    <Navbar />
                  </div>
                ) : (
                  <></>
                )}

                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute
                    exact
                    path="/my-listings"
                    component={MyListings}
                  />
                  <PrivateRoute exact path="/listing/:id" component={ListingDetail} />
                  <PublicRoute exact path="/register" component={Register} />
                  <PublicRoute exact path="/" component={Login} />
                </Switch>
              </Router>
            </ProvideAuth>
          </Container>
        )}
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default App
