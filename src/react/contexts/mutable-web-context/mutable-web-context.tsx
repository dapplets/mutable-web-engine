import { Core, IContextNode, ParserConfig } from '../../../core'
import { createContext } from 'react'

export type MutableWebContextState = {
  core: Core | null
  tree: IContextNode | null
  attachParserConfig: (parserConfig: ParserConfig) => void
  detachParserConfig: (parserId: string) => void
}

export const contextDefaultValues: MutableWebContextState = {
  core: null,
  tree: null,
  attachParserConfig: () => undefined,
  detachParserConfig: () => undefined,
}

export const MutableWebContext = createContext<MutableWebContextState>(contextDefaultValues)
