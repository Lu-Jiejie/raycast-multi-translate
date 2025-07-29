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
  const translateUrl = 'https://www2.deepl.com/jsonrpc'

  try {
    const rand = getRandomInt(100000, 200000)
    const body = {
      jsonrpc: '2.0',
      method: 'LMT_handle_texts',
      params: {
        splitting: 'newlines',
        lang: {
          source_lang_user_selected: fromCode !== 'auto' ? String(fromCode).slice(0, 2).toUpperCase() : 'auto',
          target_lang: String(toCode).slice(0, 2).toUpperCase(),
        },
        texts: [{ text, requestAlternatives: 3 }],
        timestamp: Date.now() + (text.match(/[a-z]/gi) || []).length,
      },
      id: rand,
    }

    let bodyStr = JSON.stringify(body)
    if ((rand + 5) % 29 === 0 || (rand + 3) % 13 === 0) {
      bodyStr = bodyStr.replace('"method":"', '"method" : "')
    }
    else {
      bodyStr = bodyStr.replace('"method":"', '"method": "')
    }

    const response = await axios.post(
      translateUrl,
      bodyStr,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
    const result = response.data.result.texts[0].text.trim()
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
      serviceName: 'deepl',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
