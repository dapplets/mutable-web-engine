import { Core, IContextNode, ParserConfig } from '../../../core'
import { createContext } from 'react'

export type CoreContextState = {
  tree: IContextNode | null
  attachParserConfig: (parserConfig: ParserConfig) => void
  detachParserConfig: (parserId: string) => void
  updateRootContext: (rootParsedContext: any) => void
}

export const contextDefaultValues: CoreContextState = {
  tree: null,
  attachParserConfig: () => undefined,
  detachParserConfig: () => undefined,
  updateRootContext: () => undefined,
}

export const CoreContext = createContext<CoreContextState>(contextDefaultValues)
