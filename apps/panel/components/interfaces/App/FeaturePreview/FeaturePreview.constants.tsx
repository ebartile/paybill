import { LOCAL_STORAGE_KEYS } from 'common'

export const FEATURE_PREVIEWS = [
  {
    key: LOCAL_STORAGE_KEYS.UI_PREVIEW_UNIFIED_LOGS,
    name: 'New Logs Interface',
    discussionsUrl: 'https://github.com/orgs/supabase/discussions/37234',
    isNew: true,
    isPlatformOnly: true,
  },
  {
    key: LOCAL_STORAGE_KEYS.UI_PREVIEW_BRANCHING_2_0,
    name: 'Branching 2.0',
    discussionsUrl: 'https://github.com/orgs/supabase/discussions/branching-2-0',
    isNew: true,
    isPlatformOnly: true,
  }
] as const
