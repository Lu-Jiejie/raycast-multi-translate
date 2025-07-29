import { describe, expect, it } from 'vitest'
import { translate as translateBing } from '../src/logic/service/bing'
import { translate as translateGoogle } from '../src/logic/service/google'

describe('test', () => {
  it('bing', async () => {
    expect(await translateBing(
      'Hello, World!',
      '',
      'zh-Hans',
      {} as any,
    )).toMatchInlineSnapshot(`
      {
        "error": null,
        "from": "",
        "original": "Hello, World!",
        "result": "世界您好！",
        "serviceName": "bing",
        "to": "zh-Hans",
      }
    `)
  })
  it('google', async () => {
    expect(await translateGoogle(
      'Hello, World!',
      'auto',
      'zh-CN',
      {} as any,
    )).toMatchInlineSnapshot(`
      {
        "error": null,
        "from": "auto",
        "original": "Hello, World!",
        "result": "你好世界！",
        "serviceName": "google",
        "to": "zh-CN",
      }
    `)
  })
})
