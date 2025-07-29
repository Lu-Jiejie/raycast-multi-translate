import type { LanguageCode } from './logic/language'
import type { TranslateResult as RawTranslateResult, ServiceName } from './logic/service'
import { Color, Icon, List, showToast, Toast } from '@raycast/api'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LanguageDropdown from './components/LanguageDropdown'
import TranslateDetail from './components/TranslateDetail'
import { useDebouncedValue } from './logic'
import { serviceModules, serviceTitleMap } from './logic/service'
import { settings } from './logic/settings'

type TranslateResult = RawTranslateResult & {
  loading: boolean
}

export default function MultiTranslate() {
  const { defaultSourceLanguageCode, defaultTargetLanguageCode, services } = settings
  const buildInitialResults = (inputValue: string) => {
    const isEmpty = !inputValue
    return Object.fromEntries(
      services.map(serviceName => [serviceName, {
        serviceName,
        original: inputValue,
        result: '',
        from: defaultSourceLanguageCode || 'auto',
        to: defaultTargetLanguageCode || 'en',
        error: null,
        loading: !isEmpty,
      }]),
    ) as Record<ServiceName, TranslateResult>
  }
  const [input, setInput] = useState('')
  const debouncedInput = useDebouncedValue(input.trim(), 500)
  const [results, setResults] = useState<Record<ServiceName, TranslateResult>>(buildInitialResults(''))
  const isLoading = useMemo(() => Object.values(results).some(r => r.loading), [results])
  const [targetCode, setTargetCode] = useState<LanguageCode>(defaultTargetLanguageCode)

  const updateResultAndLoading = useCallback((serviceName: ServiceName, result: TranslateResult) => {
    setResults(prev => ({
      ...prev,
      [serviceName]: { ...result, loading: false },
    }))
  }, [])

  useEffect(() => {
    if (!debouncedInput) {
      setResults(buildInitialResults(''))
      return
    }

    const trimmedInput = debouncedInput.trim()
    setResults(buildInitialResults(trimmedInput))

    services.forEach((serviceName) => {
      const service = serviceModules[serviceName]
      // const fromCode = Object.prototype.hasOwnProperty.call(service.languagesMap, defaultSourceLanguageCode)
      //   ? service.languagesMap[defaultSourceLanguageCode]!
      //   : defaultSourceLanguageCode
      // const toCode = Object.prototype.hasOwnProperty.call(service.languagesMap, defaultTargetLanguageCode)
      //   ? service.languagesMap[defaultTargetLanguageCode]!
      //   : defaultTargetLanguageCode
      const from = defaultSourceLanguageCode
      const to = targetCode

      service.translate(trimmedInput, from, to, settings)
        .then((result: RawTranslateResult) => {
          if (result.error) {
            showToast({
              style: Toast.Style.Failure,
              title: `${serviceName} Translation Error`,
              message: result.error instanceof Error ? result.error.message : String(result.error),
            })
          }
          updateResultAndLoading(serviceName, { ...result, loading: false })
        })
    })
  }, [debouncedInput, updateResultAndLoading, targetCode])

  return (
    <List
      onSearchTextChange={setInput}
      isLoading={isLoading}
      isShowingDetail={true}
      throttle={true}
      searchBarPlaceholder="Enter text to translate..."
      searchBarAccessory={(
        <LanguageDropdown
          value={targetCode}
          defaultLanguage={defaultTargetLanguageCode}
          tooltip="Select target language"
          onChange={setTargetCode}
        />
      )}
    >
      {services.map((serviceName) => {
        const item = results[serviceName]
        const serviceTitle = serviceTitleMap[serviceName].en
        return (
          <List.Section
            title={serviceTitle}
            key={serviceName}
          >
            <List.Item
              title={item.result}
              key={serviceName}
              detail={<TranslateDetail item={item} />}
              icon={`service_icon/${serviceName}.png`}
              // subtitle={serviceName}
              accessories={
                debouncedInput !== ''
                  ? item.error
                    ? [{ icon: { source: Icon.Dot, tintColor: Color.Red } }]
                    : item.result !== ''
                      ? [{ icon: { source: Icon.Dot, tintColor: Color.Green } }]
                      : item.loading
                        ? [{ icon: { source: Icon.Dot, tintColor: Color.Yellow } }]
                        : [{ icon: { source: Icon.Dot, tintColor: Color.Green } }]
                  : [{ icon: Icon.Dot }]
              }
            />
          </List.Section>

        )
      })}
    </List>
  )
}
