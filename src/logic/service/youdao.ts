import type { AxiosInstance } from 'axios'
import type { Buffer } from 'node:buffer'
import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import crypto from 'node:crypto'
import axios from 'axios'
import { formatAxiosError, getRandomInt } from '..'
import { getFromCode, getToCode } from '../language'

// https://ai.youdao.com/DOCSIRMA/html/自然语言翻译/API文档/文本翻译服务/文本翻译服务-API文档.html
export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'zh-CHS',
  zh_hant: 'zh-CHT',
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
  const client = axios.create({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 Edg/113.0.1774.42',
      'Referer': 'https://fanyi.youdao.com/',
      'Origin': 'https://fanyi.youdao.com',
      'Cookie': generateCookies(),
    },
  })
  try {
    // get secret key
    const secretKey = await fetchSecretKey(client)
    if (!secretKey) {
      throw new Error('Failed to get secret key')
    }

    // initialize encryption parameters
    const { encryptKey, iv } = initEncrypt()

    // translate request
    const response = await client.post(
      'https://dict.youdao.com/webtranslate',
      prepareTranslateParams(text, fromCode, toCode, secretKey).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    // decrypt response data
    const data = decryptResponse(response.data, encryptKey, iv)

    let result = ''

    if (!data.translateResult[0][0]) {
      result = JSON.stringify(data)
    }
    else {
      const resultArr = data.translateResult[0] as Array<{ tgt: string }>
      for (const data of resultArr)
        result += data.tgt
    }

    return {
      serviceName: 'youdao',
      original: text,
      result,
      from,
      to,
      error: null,
    }
  }
  catch (error) {
    return {
      serviceName: 'youdao',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    }
  }
}

function generateCookies(): string {
  const OUTFOX_SEARCH_USER_ID_NCOO = `OUTFOX_SEARCH_USER_ID_NCOO=${getRandomInt(100000000, 999999999)}.${getRandomInt(100000000, 999999999)}`
  const OUTFOX_SEARCH_USER_ID = `OUTFOX_SEARCH_USER_ID=${getRandomInt(100000000, 999999999)}@${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}`
  return `${OUTFOX_SEARCH_USER_ID_NCOO};${OUTFOX_SEARCH_USER_ID}`
}

async function fetchSecretKey(client: AxiosInstance): Promise<string> {
  const baseParams = prepareBaseParams('asdjnjfenknafdfsdfsd')
  const response = await client.get('https://dict.youdao.com/webtranslate/key', {
    params: {
      keyid: 'webfanyi-key-getter',
      ...baseParams,
    },
  })

  return response.data.data.secretKey
}

function initEncrypt(): { encryptKey: Buffer, iv: Buffer } {
  const getKeyBytes = (key: string): Buffer => {
    const hash = crypto.createHash('md5').update(key).digest()
    return hash.subarray(0, 16)
  }

  return {
    encryptKey: getKeyBytes('ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl'),
    iv: getKeyBytes('ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4'),
  }
}

function prepareTranslateParams(text: string, from: string, to: string, secretKey: string): URLSearchParams {
  const params = new URLSearchParams()

  params.append('i', text)
  params.append('from', from)
  params.append('to', to)
  params.append('dictResult', 'true')
  params.append('keyid', 'webfanyi')

  const baseParams = prepareBaseParams(secretKey)
  for (const [key, value] of Object.entries(baseParams)) {
    params.append(key, value)
  }

  return params
}

function prepareBaseParams(key: string): Record<string, string> {
  const now = Date.now().toString()
  return {
    sign: md5Sign(now, key),
    client: 'fanyideskweb',
    product: 'webfanyi',
    appVersion: '1.0.0',
    vendor: 'web',
    pointParam: 'client,mysticTime,product',
    mysticTime: now,
    keyfrom: 'fanyi.web',
  }
}

// get sign
function md5Sign(t: string, key: string): string {
  const str = `client=fanyideskweb&mysticTime=${t}&product=webfanyi&key=${key}`
  return crypto.createHash('md5').update(str).digest('hex')
}

function decryptResponse(encrypted: string, key: Buffer, iv: Buffer) {
  const data = encrypted.replace(/-/g, '+').replace(/_/g, '/')
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  let decrypted = decipher.update(data, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}
