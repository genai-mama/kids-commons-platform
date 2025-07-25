// URL→画像変換ユーティリティ

export interface ImageService {
  name: string
  getImageUrl: (url: string) => string
  description: string
}

// 無料のスクリーンショットサービス一覧
export const imageServices: ImageService[] = [
  {
    name: 'ScreenshotMachine',
    getImageUrl: (url: string) => 
      `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=300x200`,
    description: '無料デモ版（制限あり）'
  },
  {
    name: 'Screenshoteer',
    getImageUrl: (url: string) => 
      `https://shot.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&width=300&height=200`,
    description: '無料版'
  },
  {
    name: 'UrlBox',
    getImageUrl: (url: string) => 
      `https://api.urlbox.io/v1/demo/png?url=${encodeURIComponent(url)}&width=300&height=200`,
    description: 'デモ版'
  },
  {
    name: 'ThumbnailWS',
    getImageUrl: (url: string) => 
      `https://api.thumbnail.ws/api/demo/png?url=${encodeURIComponent(url)}&width=300`,
    description: '無料デモ版'
  }
]

// デフォルトサービス
export const defaultImageService = imageServices[0]

// URLからサムネイル画像URLを生成
export function getThumbnailUrl(originalUrl: string, serviceIndex = 0): string {
  if (!originalUrl || originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
    return originalUrl
  }

  try {
    // 有効なURLかチェック
    new URL(originalUrl)
    
    const service = imageServices[serviceIndex] || defaultImageService
    return service.getImageUrl(originalUrl)
  } catch (error) {
    console.warn('Invalid URL for thumbnail generation:', originalUrl)
    return originalUrl
  }
}

// 画像の読み込み状態を管理
export function createImageLoader() {
  const loadingUrls = new Set<string>()
  const errorUrls = new Set<string>()
  const successUrls = new Set<string>()

  return {
    isLoading: (url: string) => loadingUrls.has(url),
    isError: (url: string) => errorUrls.has(url),
    isSuccess: (url: string) => successUrls.has(url),
    
    setLoading: (url: string) => {
      loadingUrls.add(url)
      errorUrls.delete(url)
      successUrls.delete(url)
    },
    
    setSuccess: (url: string) => {
      loadingUrls.delete(url)
      errorUrls.delete(url)
      successUrls.add(url)
    },
    
    setError: (url: string) => {
      loadingUrls.delete(url)
      successUrls.delete(url)
      errorUrls.add(url)
    }
  }
}