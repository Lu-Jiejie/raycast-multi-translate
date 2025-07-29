import type { LanguageCode } from './language'
import type { ServiceName } from './service'
import { getPreferenceValues } from '@raycast/api'

export interface Settings {
  services: ServiceName[]
  defaultSourceLanguageCode: LanguageCode
  defaultTargetLanguageCode: LanguageCode
}

const preference = getPreferenceValues<Preferences>()

function parseSettings(preference: Preferences): Settings {
  const services = Array.from({ length: 7 }, (_, i) => {
    const key = `service${i + 1}` as keyof Preferences
    const serviceName = preference[key]
    return serviceName === 'none' ? null : serviceName
  }).filter(s => s !== null) as ServiceName[]

  const sourceLanguageCode = preference.defaultSourceLanguageCode as LanguageCode
  const targetLanguageCode = preference.defaultTargetLanguageCode as LanguageCode

  return {
    services,
    defaultSourceLanguageCode: sourceLanguageCode,
    defaultTargetLanguageCode: targetLanguageCode,
  }
}

export const settings = parseSettings(preference)
