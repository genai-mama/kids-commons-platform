// Firestore接続テスト
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function testFirestoreConnection() {
  try {
    console.log('🔥 Firestore接続テスト開始...')
    
    // テストデータを追加
    const testProduct = {
      id: 999,
      title: 'テスト成果物',
      category: 'テスト',
      description: 'Firestore接続テスト用のデータです',
      tags: ['テスト', 'Firestore'],
      author: {
        name: 'テストユーザー',
        avatar: 'T',
        role: 'テスター'
      },
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      thumbnail: 'https://via.placeholder.com/300x200/9B7BD8/FFFFFF?text=Test',
      featured: false,
      url: 'https://example.com'
    }

    // Productsコレクションに追加
    const docRef = await addDoc(collection(db, 'products'), testProduct)
    console.log('✅ テストデータ追加成功:', docRef.id)

    // データを読み込み
    const querySnapshot = await getDocs(collection(db, 'products'))
    console.log('📄 現在のproductsコレクション:')
    querySnapshot.forEach((doc) => {
      console.log('  -', doc.id, ':', doc.data().title)
    })

    return true
  } catch (error) {
    console.error('❌ Firestore接続エラー:', error)
    return false
  }
}

// 実行
testFirestoreConnection()