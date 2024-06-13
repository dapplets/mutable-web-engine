import { IContextNode } from '../../../../core'
import { TargetService } from '../target/target.service'
import { AppId, AppMetadata } from './application.entity'
import { ApplicationRepository } from './application.repository'

export class ApplicationService {
  constructor(private applicationRepository: ApplicationRepository) {}

  public getApplication(appId: AppId): Promise<AppMetadata | null> {
    return this.applicationRepository.getApplication(appId)
  }

  public filterSuitableApps(appsToCheck: AppMetadata[], context: IContextNode): AppMetadata[] {
    const suitableApps: AppMetadata[] = []

    for (const app of appsToCheck) {
      const suitableTargets = app.targets.filter((target) =>
        TargetService.isTargetMet(target, context)
      )

      if (suitableTargets.length > 0) {
        suitableApps.push({ ...app, targets: suitableTargets })
      }
    }

    return suitableApps
  }
}
