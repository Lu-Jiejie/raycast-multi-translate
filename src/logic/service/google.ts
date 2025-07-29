import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

// https://cloud.google.com/translate/docs/languages
export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'zh-CN',
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
  mn_cy: 'mn',
  km: 'km',
  // lo: 'lo', // Temporarily removed due to type error
  // my: 'my', // Temporarily removed due to type error
  fa: 'fa',
  nb_no: 'no',
  nn_no: 'no',
  sv: 'sv',
  pl: 'pl',
  nl: 'nl',
  uk: 'uk',
  he: 'iw',
}

export async function translate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  _settings: Settings,
): Promise<TranslateResult> {
  const fromCode = getFromCode(from, languageMap)
  const toCode = getToCode(to, languageMap)
  const translateUrl = 'https://translate.google.com/translate_a/single?dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t'

  try {
    const response = await axios.get(
      translateUrl,
      {
        params: {
          q: text,
          sl: fromCode,
          tl: toCode,
          hl: toCode,
          client: 'gtx',
          ie: 'UTF-8',
          oe: 'UTF-8',
          otf: '1',
          ssel: '0',
          tsel: '0',
          kc: '7',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const data = response.data
    let result = ''
    for (const centence of data[0]) {
      result += centence[0] || ''
    }

    return {
      serviceName: 'google',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'google',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
