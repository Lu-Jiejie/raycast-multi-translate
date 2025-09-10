import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import * as Baidu from './baidu'
import * as Bing from './bing'
import * as Caiyun from './caiyun'
import * as DeepL from './deepl'
import * as DeepLX from './deeplx'
import * as Google from './google'
import * as Ollama from './ollama'
import * as Tencent from './tencent'
import * as Transmart from './transmart'
import * as Volcengine from './volcengine'
import * as Youdao from './youdao'

export const serviceNamesArr = [
  'baidu',
  'bing',
  'google',
  'caiyun',
  'deepl',
  'deeplx',
  'ollama',
  'tencent',
  'transmart',
  'youdao',
  'volcengine',
] as const
export type ServiceName = typeof serviceNamesArr[number]
export interface TranslateResult {
  serviceName: ServiceName
  original: string
  result: string
  from: string
  to: string
  error: any
}

export const serviceModules: Record<ServiceName, {
  translate: (text: string, from: LanguageCode, to: LanguageCode, settings: Settings) => Promise<TranslateResult>
  languageMap: LanguageMap
}> = {
  baidu: Baidu,
  bing: Bing,
  google: Google,
  caiyun: Caiyun,
  deepl: DeepL,
  deeplx: DeepLX,
  ollama: Ollama,
  tencent: Tencent,
  transmart: Transmart,
  youdao: Youdao,
  volcengine: Volcengine,
}

export const serviceTitleMap: Record<ServiceName, { en: string, zh: string }> = {
  baidu: { en: 'Baidu', zh: '百度翻译' },
  bing: { en: 'Microsoft', zh: '微软翻译' },
  caiyun: { en: 'Caiyun', zh: '彩云小译' },
  deepl: { en: 'DeepL', zh: 'DeepL' },
  deeplx: { en: 'DeepLX', zh: 'DeepLX' },
  google: { en: 'Google', zh: '谷歌翻译' },
  ollama: { en: 'Ollama', zh: 'Ollama翻译' },
  tencent: { en: 'Tencent', zh: '腾讯翻译君' },
  transmart: { en: 'Transmart', zh: '腾讯交互翻译' },
  volcengine: { en: 'Volcano', zh: '火山翻译' },
  youdao: { en: 'Youdao', zh: '有道翻译' },
}
