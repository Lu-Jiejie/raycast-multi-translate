import type { LanguageCode } from '../logic/language'
import { List } from '@raycast/api'
import { useCachedState } from '@raycast/utils'
import { languageCodeArr, languageTitleMap } from '../logic/language'

export default function LanguageDropdown({
  defaultLanguage,
  tooltip,
  value,
  onChange,
  cacheDuration = 10 * 60,
}: {
  defaultLanguage: LanguageCode
  tooltip: string
  value: LanguageCode
  onChange: (newValue: LanguageCode) => void
  cacheDuration?: number
}) {
  // save user selection with timestamp using cached state
  interface CacheObj { value: LanguageCode, ts: number }
  const [cacheObj, setCacheObj] = useCachedState<CacheObj>(`dropdown-language-${tooltip}`, { value, ts: Date.now() })
  // check if cache is expired
  const now = Date.now()
  const isExpired = now - cacheObj.ts > cacheDuration * 1000
  const dropdownValue = isExpired ? defaultLanguage : cacheObj.value
  const languageOptions = [
    {
      key: defaultLanguage,
      title: languageTitleMap[defaultLanguage]?.en || defaultLanguage,
      value: defaultLanguage,
    },
    ...languageCodeArr
      .filter(code => code !== defaultLanguage && code !== 'auto') // filter out default language to avoid duplicates
      .map(code => ({
        key: code,
        title: languageTitleMap[code]?.en || code,
        value: code,
      })),
  ]

  return (
    <List.Dropdown
      tooltip={tooltip}
      value={dropdownValue}
      onChange={(newValue) => {
        setCacheObj({ value: newValue as LanguageCode, ts: Date.now() })
        onChange(newValue as LanguageCode)
      }}
    >
      {languageOptions.map(option => (
        <List.Dropdown.Item key={option.value} title={option.title} value={option.value} />
      ))}
    </List.Dropdown>
  )
}
