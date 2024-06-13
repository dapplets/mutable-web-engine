import { ParserConfigId } from './parser-config.entity'
import { ParserConfigRepository } from './parser-config.repository'

export class ParserConfigService {
  constructor(private parserConfigRepository: ParserConfigRepository) {}

  public getParserConfig(parserId: ParserConfigId) {
    return this.parserConfigRepository.getParserConfig(parserId)
  }
}
