import { Target } from '../app/services/target/target.entity'
import { UserLinkId } from '../app/services/user-link/user-link.entity'

export type BosUserLink = {
  id: UserLinkId
  appId: string
  namespace: string
  insertionPoint: string
  bosWidgetId: string
  authorId: string
  // ToDo: add props
}

export type InjectableTarget = Target & {
  injectTo: string
}
