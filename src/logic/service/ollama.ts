import type { TranslateResult } from '.'
import type { LanguageCode, LanguageMap } from '../language'
import type { Settings } from '../settings'
import axios from 'axios'
import { formatAxiosError } from '..'
import { getFromCode, getToCode } from '../language'

export const languageMap: LanguageMap = {
  auto: 'auto',
  zh: 'Chinese',
  zh_hant: 'Traditional Chinese',
  yue: 'Cantonese',
  en: 'English',
  ja: 'Japanese',
  ko: 'Korean',
  fr: 'French',
  es: 'Spanish',
  ru: 'Russian',
  de: 'German',
  it: 'Italian',
  tr: 'Turkish',
  pt: 'Portuguese',
  pt_br: 'Brazilian Portuguese',
  vi: 'Vietnamese',
  id: 'Indonesian',
  th: 'Thai',
  ms: 'Malay',
  ar: 'Arabic',
  hi: 'Hindi',
  mn_cy: 'Mongolian',
  km: 'Khmer',
  nb_no: 'Norwegian',
  nn_no: 'Norwegian Nynorsk',
  fa: 'Persian',
  sv: 'Swedish',
  pl: 'Polish',
  nl: 'Dutch',
  uk: 'Ukrainian',
  he: 'Hebrew',
  bg: 'Bulgarian',
  cs: 'Czech',
  da: 'Danish',
  et: 'Estonian',
  fi: 'Finnish',
  el: 'Greek',
  hu: 'Hungarian',
  lv: 'Latvian',
  lt: 'Lithuanian',
  ro: 'Romanian',
  sk: 'Slovak',
  sl: 'Slovenian',
}

export async function translate(
  text: string,
  from: LanguageCode,
  to: LanguageCode,
  settings: Settings,
): Promise<TranslateResult> {
  const fromCode = getFromCode(from, languageMap)
  const toCode = getToCode(to, languageMap)

  const fromLanguage = fromCode === 'auto' ? 'the source language' : fromCode
  const toLanguage = toCode

  const systemPrompt = `You are a professional translator specialized in translating text from ${fromLanguage} to ${toLanguage}.

    Guidelines:
    1. Translate the text accurately and fluently.
    2. Maintain the original meaning, tone, and style.
    3. Translate idioms and expressions to their natural equivalent in ${toLanguage}.
    4. Return ONLY the translated text, without explanations or notes.
    5. Preserve the original formatting where relevant.
    6. Proper nouns should be handled according to convention in ${toLanguage}.`

  try {
    const model = settings.ollamaModel
    const apiUrl = settings.ollamaApiUrl

    const response = await axios.post(
      `${apiUrl}/api/generate`,
      {
        model,
        system: systemPrompt,
        prompt: `${text} /no_think`,
        stream: false,
      },
      {
        timeout: 30000,
      },
    )

    const result = response.data.response || ''

    const cleanedResult = result
      .replace(/<think>[\s\S]*?<\/think>/g, '') // <think>...</think>
      .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // <thinking>...</thinking>
      .replace(/\[thinking\][\s\S]*?\[\/thinking\]/g, '') // [thinking]...[/thinking]
      .replace(/\n*thinking:.*\n/gi, '') // thinking: ...
      .trim()

    return {
      serviceName: 'ollama',
      original: text,
      result: cleanedResult,
      from,
      to,
      error: null,
    } as TranslateResult
  }
  catch (error) {
    return {
      serviceName: 'ollama',
      original: text,
      result: '',
      from,
      to,
      error: formatAxiosError(error),
    } as TranslateResult
  }
}
