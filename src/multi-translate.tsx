import type { LanguageCode } from './logic/language'
import type { TranslateResult as RawTranslateResult, ServiceName } from './logic/service'
import { Action, ActionPanel, Color, Icon, List, showToast, Toast } from '@raycast/api'
import { useCallback, useMemo, useState } from 'react'
import LanguageDropdown from './components/LanguageDropdown'
import TranslateDetail from './components/TranslateDetail'
import { serviceModules, serviceTitleMap } from './logic/service'
import { settings } from './logic/settings'

type TranslateResult = RawTranslateResult & {
  loading: boolean
}

export default function MultiTranslate() {
  const {
    defaultSourceLanguageCode,
    defaultTargetLanguageCode,
    services,
    dropdownCacheDuration,
  } = settings
  const buildInitialResults = (inputValue: string) => {
    return Object.fromEntries(
      services.map(serviceName => [serviceName, {
        serviceName,
        original: inputValue,
        result: '',
        from: defaultSourceLanguageCode || 'auto',
        to: defaultTargetLanguageCode || 'en',
        error: null,
        loading: false,
      }]),
    ) as Record<ServiceName, TranslateResult>
  }
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Record<ServiceName, TranslateResult>>(buildInitialResults(''))
  const isLoading = useMemo(() => Object.values(results).some(r => r.loading), [results])
  const [targetCode, setTargetCode] = useState<LanguageCode>(defaultTargetLanguageCode)
  const [lastTranslatedInput, setLastTranslatedInput] = useState('')

  const updateResultAndLoading = useCallback((serviceName: ServiceName, result: TranslateResult) => {
    setResults(prev => ({
      ...prev,
      [serviceName]: { ...result, loading: false },
    }))
  }, [])

  const performTranslation = useCallback(() => {
    if (!input.trim()) {
      return
    }

    const trimmedInput = input.trim()

    if (trimmedInput === lastTranslatedInput && !isLoading) {
      return
    }

    const loadingResults = Object.fromEntries(
      services.map(serviceName => [
        serviceName,
        {
          ...results[serviceName],
          original: trimmedInput,
          loading: true,
          result: '',
          error: null,
        },
      ]),
    ) as Record<ServiceName, TranslateResult>

    setResults(loadingResults)

    services.forEach((serviceName) => {
      const service = serviceModules[serviceName]
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

    setLastTranslatedInput(trimmedInput)
  }, [input, services, defaultSourceLanguageCode, targetCode, updateResultAndLoading, lastTranslatedInput, isLoading, results])

  return (
    <List
      onSearchTextChange={setInput}
      isLoading={isLoading}
      isShowingDetail={true}
      throttle={true}
      searchBarPlaceholder="Enter text to translate and press Enter..."
      searchBarAccessory={(
        <LanguageDropdown
          value={targetCode}
          defaultLanguage={defaultTargetLanguageCode}
          tooltip="Select target language"
          onChange={setTargetCode}
          cacheDuration={dropdownCacheDuration}
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
              title={item.result || item.error}
              key={serviceName}
              detail={<TranslateDetail item={item} />}
              icon={`service_icon/${serviceName}.png`}
              // subtitle={serviceName}
              accessories={
                item.error
                  ? [{ icon: { source: Icon.Dot, tintColor: Color.Red } }]
                  : item.result !== ''
                    ? [{ icon: { source: Icon.Dot, tintColor: Color.Green } }]
                    : item.loading
                      ? [{ icon: { source: Icon.Dot, tintColor: Color.Yellow } }]
                      : [{ icon: Icon.Dot }]
              }
              actions={(
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action
                      title={input.trim() === '' ? 'Enter text to translate' : 'Translate'}
                      icon={Icon.MagnifyingGlass}
                      onAction={performTranslation}
                      shortcut={{
                        macOS: { modifiers: [], key: 'return' },
                        windows: { modifiers: [], key: 'return' },
                      }}
                    />
                    <Action.CopyToClipboard
                      title="Copy Result"
                      content={item.result}
                      shortcut={{
                        macOS: { modifiers: ['cmd'], key: 'c' },
                        windows: { modifiers: ['ctrl'], key: 'c' },
                      }}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section>
                    <Action.OpenInBrowser
                      title="Open GitHub"
                      url="https://github.com/lu-jiejie/raycast-multi-translate"
                      icon={Icon.Code}
                    >
                    </Action.OpenInBrowser>
                  </ActionPanel.Section>
                </ActionPanel>
              )}
            />
          </List.Section>

        )
      })}
    </List>
  )
}
