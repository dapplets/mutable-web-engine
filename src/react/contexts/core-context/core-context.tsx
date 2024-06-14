import { Core, IContextNode, ParserConfig } from '../../../core'
import { createContext } from 'react'
import { CoreEvents } from '../../../core/events'
import { TreeBuilderEvents } from '../../../core/tree/pure-tree/pure-tree-builder'
import { EventEmitter } from '../../../core/event-emitter'

export type CoreContextState = {
  core: Core | null
  tree: IContextNode | null
  event: EventEmitter<any> | null
  attachParserConfig: (parserConfig: ParserConfig) => void
  detachParserConfig: (parserId: string) => void
}

export const contextDefaultValues: CoreContextState = {
  core: null,
  tree: null,
  event: null,
  attachParserConfig: () => undefined,
  detachParserConfig: () => undefined,
}

export const CoreContext = createContext<CoreContextState>(contextDefaultValues)
