// X (Twitter) OAuth認証のユーティリティ関数

// 環境変数から設定を取得（本番環境では適切に設定する）
const X_CLIENT_ID = import.meta.env.VITE_X_CLIENT_ID || 'your_x_client_id';
const X_REDIRECT_URI = import.meta.env.VITE_X_REDIRECT_URI || `${window.location.origin}/auth/x/callback`;

// OAuth 2.0 PKCE用のユーティリティ関数
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// X OAuth認証の開始
export const initiateXLogin = async (): Promise<void> => {
  try {
    // PKCE用のコード生成
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // セッションストレージに保存（コールバック時に使用）
    sessionStorage.setItem('x_code_verifier', codeVerifier);
    
    // スコープの設定（X API v2用）
    const scopes = [
      'tweet.read',
      'users.read',
      'offline.access'
    ].join(' ');
    
    // OAuth認証URLの構築（X API v2エンドポイント）
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', X_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', X_REDIRECT_URI);
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('state', generateCodeVerifier()); // CSRF対策
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    
    // デバッグ用ログ
    console.log('X OAuth Parameters:');
    console.log('Client ID:', X_CLIENT_ID);
    console.log('Redirect URI:', X_REDIRECT_URI);
    console.log('Scopes:', scopes);
    console.log('Auth URL:', authUrl.toString());
    
    // 認証ページにリダイレクト
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error('X OAuth initiation failed:', error);
    throw new Error('X認証の開始に失敗しました');
  }
};

// コールバック処理（X認証から戻ってきた時）
export const handleXCallback = async (code: string, state: string): Promise<any> => {
  try {
    const codeVerifier = sessionStorage.getItem('x_code_verifier');
    if (!codeVerifier) {
      throw new Error('認証セッションが見つかりません');
    }
    
    // アクセストークンの取得
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: X_CLIENT_ID,
        code: code,
        redirect_uri: X_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('アクセストークンの取得に失敗しました');
    }
    
    const tokenData = await tokenResponse.json();
    
    // ユーザー情報の取得
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,description,location,public_metrics', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('ユーザー情報の取得に失敗しました');
    }
    
    const userData = await userResponse.json();
    
    // セッションストレージからコードベリファイアを削除
    sessionStorage.removeItem('x_code_verifier');
    
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      user: userData.data,
    };
  } catch (error) {
    console.error('X OAuth callback handling failed:', error);
    throw error;
  }
};

// 簡易版：ダミーデータでのX認証（開発用）
export const mockXLogin = (): Promise<any> => {
  return new Promise((resolve) => {
    // ランダムにサンプルユーザーを選択
    const sampleUsers = [
      {
        id: '1234567890',
        username: 'ai_mama_admin',
        name: 'AIママ管理者',
        profile_image_url: 'https://via.placeholder.com/120x120/9B7BD8/FFFFFF?text=管理',
        description: '#生成AIママ部の管理者です。みなさんよろしくお願いします！',
        location: '東京, 日本',
        public_metrics: { followers_count: 500, following_count: 200, tweet_count: 1200 }
      },
      {
        id: '2345678901',
        username: 'coding_mama',
        name: 'コーディングママ',
        profile_image_url: 'https://via.placeholder.com/120x120/FF6B9D/FFFFFF?text=👩‍💻',
        description: '育児しながらWeb開発してます。Vue.jsとTypeScript勉強中！',
        location: '大阪, 日本',
        public_metrics: { followers_count: 250, following_count: 180, tweet_count: 800 }
      },
      {
        id: '3456789012',
        username: 'design_mama',
        name: 'デザインママ',
        profile_image_url: 'https://via.placeholder.com/120x120/4ECDC4/FFFFFF?text=🎨',
        description: 'UIデザイナー。子育ての合間にFigmaでデザインしてます',
        location: '横浜, 神奈川',
        public_metrics: { followers_count: 320, following_count: 150, tweet_count: 600 }
      },
      {
        id: '4567890123',
        username: 'newbie_mama',
        name: 'AI初心者ママ',
        profile_image_url: 'https://via.placeholder.com/120x120/95E1D3/FFFFFF?text=✨',
        description: 'ChatGPTを使い始めたばかり。みなさんに教えてもらいながら勉強中です！',
        location: '札幌, 北海道',
        public_metrics: { followers_count: 80, following_count: 120, tweet_count: 200 }
      }
    ];
    
    const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    
    setTimeout(() => {
      resolve({
        user: randomUser,
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
      });
    }, 1500); // 少し長めの待機時間でリアル感を演出
  });
};

// X認証が利用可能かチェック
export const isXAuthAvailable = (): boolean => {
  return X_CLIENT_ID !== 'your_x_client_id' && X_CLIENT_ID.length > 0;
};