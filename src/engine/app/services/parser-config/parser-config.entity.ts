import { BosParserConfig, JsonParserConfig } from '../../../../core'
import { Target } from '../target/target.entity'

export enum AdapterType {
  Bos = 'bos',
  Microdata = 'microdata',
  Json = 'json',
  MWeb = 'mweb',
}

export type ParserConfig =
  | ({ parserType: AdapterType.Json; id: string; targets: Target[] } & JsonParserConfig)
  | ({ parserType: AdapterType.Bos; id: string; targets: Target[] } & BosParserConfig)
  | { parserType: AdapterType.MWeb; id: string; targets: Target[] }
