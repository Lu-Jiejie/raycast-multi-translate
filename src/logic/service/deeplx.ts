import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError, getRandomInt } from '..'
import { getFromCode, getToCode } from '../language'

// https://www.deepl.com/docs-api/translate-text
export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'ZH',
  zh_hant: 'ZH',
  en: 'EN',
  ja: 'JA',
  ko: 'KO',
  fr: 'FR',
  es: 'ES',
  ru: 'RU',
  de: 'DE',
  it: 'IT',
  tr: 'TR',
  pt: 'PT',
  pt_br: 'PT',
  nl: 'NL',
  pl: 'PL',
  sv: 'SV',
  bg: 'BG',
  ro: 'RO',
  cs: 'CS',
  da: 'DA',
  fi: 'FI',
  el: 'EL',
  hu: 'HU',
  lt: 'LT',
  lv: 'LV',
  sk: 'SK',
  sl: 'SL',
  et: 'ET',
}

export async function translate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  _settings: Settings,
): Promise<TranslateResult> {
  const fromCode = getFromCode(from, languageMap)
  const toCode = getToCode(to, languageMap)
  const translateUrl = _settings.deeplxApiUrl

  try {
    if (translateUrl === '') {
      throw new Error('DeepLX API URL is not set')
    }
    const response = await axios.post(
      translateUrl,
      {
        text,
        source_lang: fromCode,
        target_lang: toCode,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
    const result = response.data.data
    return {
      serviceName: 'deepl',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'deeplx',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
