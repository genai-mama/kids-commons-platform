// Discord API ユーティリティ

export interface DiscordServerInfo {
  id: string
  name: string
  instant_invite?: string
  channels: Array<{
    id: string
    name: string
    position: number
  }>
  members: Array<{
    id: string
    username: string
    discriminator: string
    avatar?: string
    status: string
    avatar_url: string
  }>
  presence_count: number
}

export interface DiscordWidgetInfo {
  id: string
  name: string
  instant_invite?: string
  channels: Array<{
    id: string
    name: string
    position: number
  }>
  members: Array<{
    id: string
    username: string
    discriminator: string
    avatar?: string
    status: string
    avatar_url: string
  }>
  presence_count: number
}

// Discord Widget APIを使用（サーバーでWidget設定が有効である必要があります）
export async function getDiscordServerInfo(serverId: string): Promise<DiscordWidgetInfo | null> {
  try {
    const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`)
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Discord Widget is disabled for this server')
      }
      throw new Error(`Discord API error: ${response.status}`)
    }
    
    const data: DiscordWidgetInfo = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch Discord server info:', error)
    return null
  }
}

// プロキシサーバー経由でCORS回避（オプション）
export async function getDiscordServerInfoWithProxy(serverId: string): Promise<DiscordWidgetInfo | null> {
  try {
    // 複数のCORSプロキシを試行
    const proxyUrls = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://discord.com/api/guilds/${serverId}/widget.json`)}`,
      `https://corsproxy.io/?${encodeURIComponent(`https://discord.com/api/guilds/${serverId}/widget.json`)}`,
      `https://cors-anywhere.herokuapp.com/https://discord.com/api/guilds/${serverId}/widget.json`
    ]
    
    for (const proxyUrl of proxyUrls) {
      try {
        const response = await fetch(proxyUrl)
        if (!response.ok) continue
        
        const data = await response.json()
        
        // allorigins の場合は contents プロパティからデータを取得
        if (data.contents) {
          return JSON.parse(data.contents)
        }
        
        return data
      } catch (error) {
        console.warn(`Proxy ${proxyUrl} failed:`, error)
        continue
      }
    }
    
    throw new Error('All proxy attempts failed')
  } catch (error) {
    console.error('Failed to fetch Discord server info with proxy:', error)
    return null
  }
}

// Discord招待リンクから基本情報を取得
export async function getDiscordInviteInfo(inviteCode: string): Promise<any> {
  try {
    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`)
    
    if (!response.ok) {
      throw new Error(`Discord Invite API error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      guild: data.guild,
      memberCount: data.approximate_member_count,
      presenceCount: data.approximate_presence_count
    }
  } catch (error) {
    console.error('Failed to fetch Discord invite info:', error)
    return null
  }
}

// サーバーIDからメンバー数を取得（メイン関数）
export async function getDiscordMemberCount(serverId: string): Promise<{
  memberCount: number
  onlineCount: number
  serverName: string
} | null> {
  try {
    // まずWidget APIを試行
    let serverInfo = await getDiscordServerInfo(serverId)
    
    // Widget APIが失敗した場合、プロキシ経由で試行
    if (!serverInfo) {
      console.log('Widget API failed, trying with proxy...')
      serverInfo = await getDiscordServerInfoWithProxy(serverId)
    }
    
    if (serverInfo) {
      return {
        memberCount: serverInfo.members.length,
        onlineCount: serverInfo.presence_count,
        serverName: serverInfo.name
      }
    }
    
    return null
  } catch (error) {
    console.error('Failed to get Discord member count:', error)
    return null
  }
}

// リアルタイム更新用の関数
export function createDiscordDataFetcher(serverId: string, updateInterval = 60000) {
  let intervalId: NodeJS.Timeout | null = null
  let isRunning = false
  
  const callbacks: Array<(data: any) => void> = []
  
  const fetchData = async () => {
    const data = await getDiscordMemberCount(serverId)
    callbacks.forEach(callback => callback(data))
  }
  
  return {
    start: () => {
      if (isRunning) return
      
      isRunning = true
      fetchData() // 初回実行
      intervalId = setInterval(fetchData, updateInterval)
    },
    
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      isRunning = false
    },
    
    subscribe: (callback: (data: any) => void) => {
      callbacks.push(callback)
      return () => {
        const index = callbacks.indexOf(callback)
        if (index > -1) callbacks.splice(index, 1)
      }
    },
    
    fetchNow: fetchData
  }
}