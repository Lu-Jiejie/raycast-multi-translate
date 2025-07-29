import type { TranslateResult } from '../logic/service'
import { List } from '@raycast/api'
import { languageTitleMap } from '../logic/language'
import { serviceTitleMap } from '../logic/service'

export default function TranslateDetail({
  item,
}: {
  item: TranslateResult
}) {
  const markdown = item.error || item.result || ' '
  const serviceTitle = serviceTitleMap[item.serviceName].en
  const fromTitle = languageTitleMap[item.from as keyof typeof languageTitleMap]?.en ?? item.from
  const toTitle = languageTitleMap[item.to as keyof typeof languageTitleMap]?.en ?? item.to

  return (
    <List.Item.Detail
      markdown={markdown}
      metadata={(
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.TagList title="Service">
            <List.Item.Detail.Metadata.TagList.Item text={serviceTitle} />
          </List.Item.Detail.Metadata.TagList>
          <List.Item.Detail.Metadata.TagList title="From">
            <List.Item.Detail.Metadata.TagList.Item text={fromTitle} />
          </List.Item.Detail.Metadata.TagList>
          <List.Item.Detail.Metadata.TagList title="To">
            <List.Item.Detail.Metadata.TagList.Item text={toTitle} />
          </List.Item.Detail.Metadata.TagList>
        </List.Item.Detail.Metadata>
      )}
    />
  )
}
