<p align="center">
<img src="./assets/icon.png" height="140">
</p>

<h1 align="center">
MultiTranslate
</h1>

<p align="center">
A Raycast plugin that translates text using multiple translation services.
</p>

<img width="900px" src="./assets/example.png">

## Supports

### Without configuration

- [Youdao](https://fanyi.youdao.com/)
- [Google](https://translate.google.com/)
- [Baidu](https://fanyi.baidu.com/)
- [Bing](https://www.bing.com/translator)
- [DeepL](https://www.deepl.com/translator)
- [Tencent](https://fanyi.qq.com/)
- [Transmart](https://transmart.qq.com)
- [Caiyun](https://fanyi.caiyunapp.com/)
- [Volcengine](https://translate.volcengine.com/)

> [!IMPORTANT]
> The above services are unofficial. Please use with discretion.

### Need configuration

These services may require API keys or other configuration. Please refer to the documentation for each service for more information.

- DeepLX (needs API url)
- [Ollama](https://github.com/ollama/ollama) (needs model name)

## Installation

This extension has not been published to the Raycast Store yet, so you need to install it manually by cloning the repository and running it in development mode.

You should have [Node.js](https://nodejs.org/en/download/) and [pnpm](https://pnpm.io/installation) installed before installing.

1. Clone this repository

```bash
git clone https://github.com/Lu-Jiejie/raycast-multi-translate
```

2. Go to the cloned directory and install dependencies

```bash
cd raycast-multi-translate
pnpm install
```

3. Install this extension in Raycast

```bash
pnpm run dev
```

## Language Codes List

+ I can only ensure the common languages are supported.
+ Each service may support different languages.

```typescript
export const languageCodesArr = [
  'auto',
  'zh',
  'zh_hant',
  'yue',
  'en',
  'ja',
  'ko',
  'fr',
  'es',
  'ru',
  'de',
  'it',
  'tr',
  'pt_pt',
  'pt_br',
  'vi',
  'id',
  'th',
  'ms',
  'ar',
  'hi',
  'ml',
  'mn_cy',
  'mn_mo',
  'km',
  'nb_no',
  'nn_no',
  'fa',
  'sv',
  'pl',
  'nl',
  'uk',
  'he',
  'bg',
  'cs',
  'da',
  'et',
  'fi',
  'el',
  'hu',
  'lv',
  'lt',
  'ro',
  'sk',
  'sl',
] as const
```

## Thanks

[pot-app](https://github.com/pot-app/pot-desktop)
