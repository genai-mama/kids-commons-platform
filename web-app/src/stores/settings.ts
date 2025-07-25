import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 画像表示設定
  const enableScreenshots = ref(true)
  const screenshotServiceIndex = ref(0)
  const fallbackToOriginal = ref(true)

  // ローカルストレージから設定を読み込み
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('app-settings')
      if (saved) {
        const settings = JSON.parse(saved)
        enableScreenshots.value = settings.enableScreenshots ?? true
        screenshotServiceIndex.value = settings.screenshotServiceIndex ?? 0
        fallbackToOriginal.value = settings.fallbackToOriginal ?? true
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  // 設定をローカルストレージに保存
  const saveSettings = () => {
    try {
      const settings = {
        enableScreenshots: enableScreenshots.value,
        screenshotServiceIndex: screenshotServiceIndex.value,
        fallbackToOriginal: fallbackToOriginal.value
      }
      localStorage.setItem('app-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  // 設定更新
  const updateScreenshotSettings = (enabled: boolean, serviceIndex?: number, fallback?: boolean) => {
    enableScreenshots.value = enabled
    if (serviceIndex !== undefined) {
      screenshotServiceIndex.value = serviceIndex
    }
    if (fallback !== undefined) {
      fallbackToOriginal.value = fallback
    }
    saveSettings()
  }

  return {
    // State
    enableScreenshots,
    screenshotServiceIndex,
    fallbackToOriginal,
    // Actions
    loadSettings,
    saveSettings,
    updateScreenshotSettings
  }
})