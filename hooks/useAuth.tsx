import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import { auth } from '../fireabse'
import { useRouter } from 'next/router'

interface AuthProviderProps {
  children: React.ReactNode
}

interface IAuth {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  logIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  logIn: async () => {},
  logout: async () => {},
  error: null,
  loading: false,
})

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setLoading(false)
        router.push('/')
      } else {
        setUser(null)
        setLoading(true)
        router.push('/login')
      }
    })
    setInitialLoading(false)
  }, [auth])

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          setUser(userCredential.user)
        }
      )
    } catch (error) {
      alert(error)
    }
    setLoading(false)
  }

  const logIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          setUser(userCredential.user)
        }
      )
    } catch (error) {
      alert(error)
    }
    setLoading(false)
  }

  const logout = async () => {
    setLoading(true)
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => alert(error))
      .finally(() => setLoading(false))
  }

  const memorizedValue = useMemo(
    () => ({
      user,
      logIn,
      logout,
      signUp,
      loading,
      error: null,
    }),
    [user, loading]
  )

  return (
    <AuthContext.Provider value={memorizedValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
