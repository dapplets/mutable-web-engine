import { AppId, AppMetadata } from './application.entity'
import { ApplicationRepository } from './application.repository'

export class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}

  public getApplication(appId: AppId): Promise<AppMetadata | null> {
    return this.applicationRepository.getApplication(appId)
  }
}
