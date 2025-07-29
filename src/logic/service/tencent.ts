import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

// https://cloud.tencent.com/document/product/551/15611
export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'zh',
  zh_hant: 'zh-TW',
  yue: 'zh-HK',
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
  const translateUrl = 'https://wxapp.translator.qq.com/api/translate'
  try {
    const response = await axios.get(translateUrl, {
      params: {
        source: 'auto',
        target: 'auto',
        sourceText: text,
        platform: 'WeChat_APP',
        guid: 'oqdgX0SIwhvM0TmqzTHghWBvfk22',
        candidateLangs: `${fromCode}|${toCode}`,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.32(0x18002035) NetType/WIFI Language/zh_TW',
        'Content-Type': 'application/json',
        'Host': 'wxapp.translator.qq.com',
        'Referer': 'https://servicewechat.com/wxb1070eabc6f9107e/117/page-frame.html',
      },
    })

    const result = response.data.targetText
    return {
      serviceName: 'tencent',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'tencent',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
