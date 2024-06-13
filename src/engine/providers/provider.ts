import { Target } from '../app/services/target/target.entity'

export type InjectableTarget = Target & {
  injectTo: string
}
