import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

// https://transmart.qq.com/ 支持的语言
export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'zh',
  zh_hant: 'zh-TW',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr',
  es: 'es',
  ru: 'ru',
  de: 'de',
  it: 'it',
  tr: 'tr',
  pt: 'pt',
  pt_br: 'pt',
  vi: 'vi',
  id: 'id',
  th: 'th',
  ms: 'ms',
  ar: 'ar',
  hi: 'hi',
}

export async function translate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  _settings: Settings,
): Promise<TranslateResult> {
  const fromCode = getFromCode(from, languageMap)
  const toCode = getToCode(to, languageMap)
  const url = 'https://transmart.qq.com/api/imt'
  try {
    const response = await axios.post(url, {
      header: {
        fn: 'auto_translation',
        client_key: 'browser-chrome-110.0.0-Mac OS-df4bd4c5-a65d-44b2-a40f-42f34f3535f2-1677486696487',
      },
      type: 'plain',
      model_category: 'normal',
      source: {
        lang: fromCode,
        text_list: [text],
      },
      target: {
        lang: toCode,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'referer': 'https://transmart.qq.com/zh-CN/index',
      },
    })
    const result = (response.data.auto_translation || []).join('\n').trim()
    return {
      serviceName: 'transmart',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'transmart',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
