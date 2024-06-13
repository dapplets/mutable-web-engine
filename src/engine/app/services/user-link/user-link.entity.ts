import { AppId } from '../application/application.entity'
import { MutationId } from '../mutation/mutation.entity'
import { ScalarType } from '../target/target.entity'

export type UserLinkId = string

export type LinkIndex = string

export type IndexedLink = {
  id: UserLinkId
  authorId: string
}

export type LinkIndexObject = {
  appId: AppId
  mutationId: MutationId

  // context related fields
  namespace: string
  contextType: string
  if: Record<string, ScalarType> // similar like Target but with ScalarType instead of TargetCondition
}
