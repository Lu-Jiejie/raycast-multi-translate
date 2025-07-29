import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

// https://www.volcengine.com/docs/4640/65067
export const languageMap: LanguageMap = {
  auto: 'detect',
  zh: 'zh',
  zh_hant: 'zh-Hant',
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
  pt_br: 'pt-BR',
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
  const translateUrl = 'https://translate.volcengine.com/crx/translate/v1'
  try {
    const response = await axios.post(
      translateUrl,
      {
        text,
        source_language: fromCode,
        target_language: toCode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    const result = response.data.translation
    return {
      serviceName: 'volcengine',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'volcengine',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
