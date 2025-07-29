import type { LanguageCode } from '../logic/language'
import { List } from '@raycast/api'
import { languageCodeArr, languageTitleMap } from '../logic/language'

export default function LanguageDropdown({
  defaultLanguage,
  tooltip,
  value,
  onChange,
}: {
  defaultLanguage: LanguageCode
  tooltip: string
  value: LanguageCode
  onChange: (newValue: LanguageCode) => void
}) {
  const languageOptions = [
    {
      key: defaultLanguage,
      title: languageTitleMap[defaultLanguage]?.en || defaultLanguage,
      value: defaultLanguage,
    },
    ...languageCodeArr
      .filter(code => code !== defaultLanguage && code !== 'auto') // 过滤掉默认语言避免重复
      .map(code => ({
        key: code,
        title: languageTitleMap[code]?.en || code,
        value: code,
      })),
  ]

  return (
    <List.Dropdown
      tooltip={tooltip}
      value={value}
      onChange={newValue => onChange(newValue as LanguageCode)}
    >
      {languageOptions.map(option => (
        <List.Dropdown.Item key={option.value} title={option.title} value={option.value} />
      ))}
    </List.Dropdown>
  )
}
