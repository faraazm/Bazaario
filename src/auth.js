import { initFirebase } from './firebase'
import { useContext, createContext, useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

// Start up firebase
initFirebase();

const authContext = createContext()

export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

export const PrivateRoute = ({ component: Component, ...props }) => {
  // Add your own authentication on the below line.
  const auth = useAuth()
  const isAuthenticated = auth.user

  return (
    <Route
      {...props}
      render={(routeProps) =>
        isAuthenticated ? <Component {...routeProps} /> : <Redirect to="/" />
      }
    />
  )
}

export const PublicRoute = ({ component: Component, ...props }) => {
  // Add your own authentication on the below line.
  const auth = useAuth()
  const isAuthenticated = auth.user

  return (
    <Route
      {...props}
      render={(routeProps) =>
        !isAuthenticated ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  )
}

export function useProvideAuth() {
  const [user, setUser] = useState(null)

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        setUser(user)
        return user
      })
      .catch((error) => {
        setUser(false)
      })
  }

  const signUp = async (email, password) => {
    const auth = getAuth()
    const result = await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        setUser(user)
        return { error: false, user }
      })
      .catch((error) => {
        setUser(false)
        return { error, user: false }
      })

    return result
  }

  const signIn = async (email, password) => {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        setUser(user)
        return user
      })
      .catch((error) => {
        setUser(false)
        return user
      })
  }

  const logOut = (cb) => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(false)
        if (cb) cb()
      })
      .catch((error) => {
        // An error happened.
        console.log(error.errorMessage)
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser)
    return () => {
      setUser(false)
      unsubscribe()
    }
  }, [])

  return {
    user,
    signInWithGoogle,
    signUp,
    signIn,
    logOut,
  }
}