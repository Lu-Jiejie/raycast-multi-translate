import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

// https://fanyi-api.baidu.com/product/113
export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'zh',
  zh_hant: 'cht',
  yue: 'yue',
  en: 'en',
  ja: 'jp',
  ko: 'kor',
  fr: 'fra',
  es: 'spa',
  ru: 'ru',
  de: 'de',
  it: 'it',
  tr: 'tr',
  pt: 'pt',
  pt_br: 'pot',
  vi: 'vie',
  id: 'id',
  th: 'th',
  ms: 'may',
  ar: 'ar',
  hi: 'hi',
  km: 'hkm',
  nb_no: 'nob',
  nn_no: 'nno',
  fa: 'per',
  sv: 'swe',
  pl: 'pl',
  nl: 'nl',
  uk: 'ukr',
  he: 'heb',
}

export async function translate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  _settings: Settings,
): Promise<TranslateResult> {
  const fromCode = getFromCode(from, languageMap)
  const toCode = getToCode(to, languageMap)
  const url = `http://res.d.hjfile.cn/v10/dict/translation/${fromCode}/${toCode}`
  const formData = new FormData()
  formData.append('content', text)
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Host': 'res.d.hjfile.cn',
        'Origin': 'http://res.d.hjfile.cn',
        'Referer': 'http://res.d.hjfile.cn/app/trans',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'HJ_UID=390f25c7-c9f3-b237-f639-62bd23cd431f; HJC_USRC=uzhi; HJC_NUID=1',
      },
    })
    const result = response.data?.data?.content || ''
    return {
      serviceName: 'baidu',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'baidu',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}
