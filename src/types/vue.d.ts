import { ApiType } from '../services/index'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiType,
  }
}
