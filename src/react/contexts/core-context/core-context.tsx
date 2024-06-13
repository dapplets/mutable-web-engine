import { Core, IContextNode, ParserConfig } from '../../../core'
import { createContext } from 'react'

export type CoreContextState = {
  core: Core | null
  tree: IContextNode | null
  attachParserConfig: (parserConfig: ParserConfig) => void
  detachParserConfig: (parserId: string) => void
  updateRootContext: (rootParsedContext: any) => void
}

export const contextDefaultValues: CoreContextState = {
  core: null,
  tree: null,
  attachParserConfig: () => undefined,
  detachParserConfig: () => undefined,
  updateRootContext: () => undefined,
}

export const CoreContext = createContext<CoreContextState>(contextDefaultValues)
