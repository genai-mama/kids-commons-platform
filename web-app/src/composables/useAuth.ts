// Firebase Authentication用のComposable
import { ref } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
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

  // Googleログイン
  const signInWithGoogle = async (useRedirect: boolean = false) => {
    try {
      isLoading.value = true
      error.value = null
      
      const provider = new GoogleAuthProvider()
      // より詳細な権限をリクエスト
      provider.addScope('profile')
      provider.addScope('email')
      
      let userCredential
      
      if (useRedirect) {
        // リダイレクト方式
        await signInWithRedirect(auth, provider)
        // リダイレクト後の処理は initializeAuth で処理される
        return null
      } else {
        // ポップアップ方式（デフォルト）
        try {
          userCredential = await signInWithPopup(auth, provider)
        } catch (popupError: any) {
          console.warn('Popup failed, falling back to redirect:', popupError.code)
          
          // ポップアップがブロックされた場合はリダイレクトにフォールバック
          if (popupError.code === 'auth/popup-blocked' || 
              popupError.code === 'auth/popup-closed-by-user') {
            await signInWithRedirect(auth, provider)
            return null
          }
          throw popupError
        }
      }
      
      currentUser.value = userCredential.user
      
      // 初回ログインの場合、Firestoreにユーザー情報を保存
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date().toISOString(),
          provider: 'google'
        })
      }
      
      console.log('Google Authentication success:', userCredential.user.email)
      return userCredential.user
    } catch (err: any) {
      console.error('Google Authentication failed:', err)
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        customData: err.customData
      })
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          error.value = 'ログインがキャンセルされました'
          break
        case 'auth/popup-blocked':
          error.value = 'ポップアップがブロックされました。リダイレクト方式を試します'
          break
        case 'auth/cancelled-popup-request':
          error.value = 'ログインがキャンセルされました'
          break
        case 'auth/unauthorized-domain':
          error.value = '承認されていないドメインからのアクセスです'
          break
        case 'auth/operation-not-allowed':
          error.value = 'Google認証が有効化されていません'
          break
        default:
          error.value = `Googleログインに失敗しました: ${err.message}`
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
  const initializeAuth = async () => {
    // リダイレクト結果を処理
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        console.log('Redirect result received:', result.user.email)
        currentUser.value = result.user
        
        // 初回ログインの場合、Firestoreにユーザー情報を保存
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: new Date().toISOString(),
            provider: 'google'
          })
        }
      }
    } catch (redirectError: any) {
      console.error('Redirect result error:', redirectError)
    }
    
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
    signInWithGoogle,
    logout,
    getUserProfile,
    initializeAuth
  }
}