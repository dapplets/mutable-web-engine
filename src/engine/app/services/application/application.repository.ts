import { SocialDbService } from '../social-db/social-db.service'
import { AppId, AppMetadata } from './application.entity'

const ProjectIdKey = 'dapplets.near'
const SettingsKey = 'settings'
const SelfKey = ''
const AppKey = 'app'
const WildcardKey = '*'
const RecursiveWildcardKey = '**'
const KeyDelimiter = '/'

export class ApplicationRepository {
  constructor(private socialDb: SocialDbService) {}

  async getApplication(globalAppId: AppId): Promise<AppMetadata | null> {
    const [authorId, , appLocalId] = globalAppId.split(KeyDelimiter)

    const keys = [authorId, SettingsKey, ProjectIdKey, AppKey, appLocalId]
    const queryResult = await this.socialDb.get([
      [...keys, RecursiveWildcardKey].join(KeyDelimiter),
    ])

    const app = SocialDbService.getValueByKey(keys, queryResult)

    if (!app?.[SelfKey]) return null

    return {
      ...JSON.parse(app[SelfKey]),
      metadata: app.metadata,
      id: globalAppId,
      appLocalId,
      authorId,
    }
  }

  async getApplications(): Promise<AppMetadata[]> {
    const keys = [
      WildcardKey, // any author id
      SettingsKey,
      ProjectIdKey,
      AppKey,
      WildcardKey, // any app local id
    ]

    const queryResult = await this.socialDb.get([
      [...keys, RecursiveWildcardKey].join(KeyDelimiter),
    ])

    const appsByKey = SocialDbService.splitObjectByDepth(queryResult, keys.length)

    const apps = Object.entries(appsByKey).map(([key, app]: [string, any]) => {
      const [authorId, , , , appLocalId] = key.split(KeyDelimiter)
      const globalAppId = [authorId, AppKey, appLocalId].join(KeyDelimiter)

      return {
        ...JSON.parse(app[SelfKey]),
        metadata: app.metadata,
        id: globalAppId,
        appLocalId,
        authorId,
      }
    })

    return apps
  }

  async saveApplication(
    appMetadata: Omit<AppMetadata, 'authorId' | 'appLocalId'>
  ): Promise<AppMetadata> {
    const [authorId, , appLocalId] = appMetadata.id.split(KeyDelimiter)

    const keys = [authorId, SettingsKey, ProjectIdKey, AppKey, appLocalId]

    const storedAppMetadata = {
      [SelfKey]: JSON.stringify({
        targets: appMetadata.targets,
      }),
      metadata: appMetadata.metadata,
    }

    await this.socialDb.set(SocialDbService.buildNestedData(keys, storedAppMetadata))

    return {
      ...appMetadata,
      appLocalId,
      authorId,
    }
  }
}
