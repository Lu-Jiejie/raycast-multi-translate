import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

// https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
export const languageMap: LanguageMap = {
  auto: '',
  zh: 'zh-Hans',
  zh_hant: 'zh-Hant',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr',
  es: 'es',
  ru: 'ru',
  de: 'de',
  it: 'it',
  vi: 'vi',
  id: 'id',
  th: 'th',
  ar: 'ar',
  hi: 'hi',
  nl: 'nl',
  uk: 'uk',
}

export async function translate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  _settings: Settings,
): Promise<TranslateResult> {
  const fromCode = getFromCode(from, languageMap)
  const toCode = getToCode(to, languageMap)
  const tokenUrl = 'https://edge.microsoft.com/translate/auth'
  const translateUrl = 'https://api-edge.cognitive.microsofttranslator.com/translate'
  try {
    const tokenResponse = await axios.get(tokenUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 Edg/113.0.1774.42',
      },
    })
    const token = tokenResponse.data
    const response = await axios.post(
      translateUrl,
      [
        {
          Text: text,
        },
      ],
      {
        params: {
          'from': fromCode,
          'to': toCode,
          'api-version': '3.0',
          'includeSentenceLength': 'true',
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 Edg/113.0.1774.42',
        },
      },
    )
    const data = response.data
    const result = data[0]?.translations?.[0]?.text?.trim() || ''
    return {
      serviceName: 'bing',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'bing',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
