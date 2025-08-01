import { readFile, writeFile } from 'node:fs/promises'
import { languageCodeArr, languageTitleMap } from '../src/logic/language'
import { serviceNamesArr, serviceTitleMap } from '../src/logic/service'

(async () => {
  const pkg = JSON.parse(await readFile('./package.json', 'utf-8'))
  const languageOptions = languageCodeArr.map(code => ({
    title: languageTitleMap[code].en,
    value: code,
  }))

  const serviceOptions = [
    {
      title: '-',
      value: 'none',
    },
    ...serviceNamesArr.map(serviceName => ({
      title: serviceTitleMap[serviceName].en,
      value: serviceName,
    })),
  ]

  const servicePreferences = Array.from({ length: 7 }, (_, i) => {
    return {
      name: `service${i + 1}`,
      title: `Service ${i + 1}`,
      description: `Select translation service ${i + 1}.`,
      type: 'dropdown',
      data: serviceOptions,
      default: serviceOptions[i + 1].value,
      required: true,
    }
  })

  pkg.preferences = [
    // {
    //   name: 'services',
    //   title: 'Translation Services',
    //   description: 'Comma-separated list of translation services to use.',
    //   type: 'textfield',
    //   default: 'youdao,deepl,google,bing',
    //   placeholder: 'Enter services',
    //   required: true,
    // },
    {
      name: 'defaultSourceLanguageCode',
      title: 'Default Source Language',
      description: 'Default language code for the source language.',
      type: 'dropdown',
      default: 'auto',
      data: languageOptions,
      required: true,
    },
    {
      name: 'defaultTargetLanguageCode',
      title: 'Default Target Language',
      description: 'Default language code for the target language.',
      type: 'dropdown',
      default: 'en',
      data: languageOptions.slice(1),
      required: true,
    },
    // {
    //   name: 'languageCodePairs',
    //   title: 'LanguageCodePairs',
    //   description: 'Comma-separated list of language pairs in the format "source>target".',
    //   type: 'textfield',
    //   required: true,
    // },
    ...servicePreferences,
  ]

  await writeFile('./package.json', JSON.stringify(pkg, null, 2), 'utf-8')
}
)()
