import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import * as Baidu from './baidu'
import * as Bing from './bing'
import * as Caiyun from './caiyun'
import * as DeepL from './deepl'
import * as Google from './google'
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
  google: { en: 'Google', zh: '谷歌翻译' },
  tencent: { en: 'Tencent', zh: '腾讯翻译君' },
  transmart: { en: 'Transmart', zh: '腾讯交互翻译' },
  volcengine: { en: 'Volcano', zh: '火山翻译' },
  youdao: { en: 'Youdao', zh: '有道翻译' },
}

// export async function translateWithServices(
//   text: string,
//   from: LanguageCode,
//   to: LanguageCode,
//   services: ServiceName[],
//   _settings: Settings,
// ) {
//   if (!text) {
//     return services.map((serviceName) => {
//       const service = serviceModules[serviceName]
//       const fromCode = service.languagesMap[from] !== undefined
//         ? service.languagesMap[from]
//         : from
//       const toCode = service.languagesMap[to] !== undefined
//         ? service.languagesMap[to]
//         : to
//       return {
//         serviceName,
//         original: text,
//         result: '',
//         from: fromCode,
//         to: toCode,
//         error: null,
//       }
//     })
//   }

//   const results = await Promise.all(
//     services.map(async (serviceName) => {
//       const service = serviceModules[serviceName]
//       const fromCode = service.languagesMap[from] !== undefined
//         ? service.languagesMap[from]
//         : from
//       const toCode = service.languagesMap[to] !== undefined
//         ? service.languagesMap[to]
//         : to
//       const result = await service.translate(text, fromCode, toCode, _settings)
//       return result
//     }),
//   )

//   return results
// }
