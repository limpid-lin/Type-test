export const PUNCTUATION_MAP: Record<string, string> = {
  '，': ',',
  '。': '.',
  '？': '?',
  '！': '!',
  '；': ';',
  '：': ':',
  '“': '"',
  '”': '"',
  '‘': "'",
  '’': "'",
  '【': '[',
  '】': ']',
  '（': '(',
  '）': ')',
  '《': '<',
  '》': '>',
  '、': ','
}

export const STORAGE_KEYS = {
  ARTICLES_CN: 'ContentInfoCN',
  ARTICLES_EN: 'ContentInfoEN',
  THEME: 'theme',
  SOUND_PACK: 'soundPack',
  SOUND_ENABLED: 'soundEnabled',
  STATS: 'typingStats'
} as const
