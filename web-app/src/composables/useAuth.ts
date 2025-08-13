// Firebase Authentication用のComposable
import { ref } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export function useAuth() {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ログイン
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      currentUser.value = userCredential.user
      
      console.log('Firebase Authentication success:', userCredential.user.email)
      return userCredential.user
    } catch (err: any) {
      console.error('Firebase Authentication failed:', err)
      
      // Firebase Authのエラーコードに応じたメッセージ
      switch (err.code) {
        case 'auth/user-not-found':
          error.value = 'このメールアドレスのユーザーは存在しません'
          break
        case 'auth/wrong-password':
          error.value = 'パスワードが間違っています'
          break
        case 'auth/invalid-email':
          error.value = 'メールアドレスの形式が正しくありません'
          break
        case 'auth/user-disabled':
          error.value = 'このユーザーアカウントは無効化されています'
          break
        case 'auth/too-many-requests':
          error.value = 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください'
          break
        default:
          error.value = 'ログインに失敗しました'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // サインアップ
  const signup = async (email: string, password: string, userData: any) => {
    try {
      isLoading.value = true
      error.value = null
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      currentUser.value = userCredential.user
      
      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date().toISOString(),
        ...userData
      })
      
      console.log('User created successfully:', userCredential.user.email)
      return userCredential.user
    } catch (err: any) {
      console.error('Signup failed:', err)
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          error.value = 'このメールアドレスは既に使用されています'
          break
        case 'auth/weak-password':
          error.value = 'パスワードが弱すぎます（6文字以上で入力してください）'
          break
        case 'auth/invalid-email':
          error.value = 'メールアドレスの形式が正しくありません'
          break
        default:
          error.value = 'アカウント作成に失敗しました'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ログアウト
  const logout = async () => {
    try {
      await signOut(auth)
      currentUser.value = null
      console.log('Logout successful')
    } catch (err: any) {
      console.error('Logout failed:', err)
      error.value = 'ログアウトに失敗しました'
      throw err
    }
  }

  // ユーザープロフィールをFirestoreから取得
  const getUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log('No user profile found')
        return null
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      return null
    }
  }

  // 認証状態の監視
  const initializeAuth = () => {
    return onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      console.log('Auth state changed:', user?.email || 'No user')
    })
  }

  return {
    currentUser,
    isLoading,
    error,
    login,
    signup,
    logout,
    getUserProfile,
    initializeAuth
  }
}