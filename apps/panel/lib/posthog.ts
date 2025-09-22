import { components } from 'common'
import { hasConsented } from 'common'
import { handleError, post } from 'data/fetchers'

type TrackFeatureFlagVariables = components['schemas']['TelemetryFeatureFlagBody']

export async function trackFeatureFlag(body: TrackFeatureFlagVariables) {
  const consent = hasConsented()

  if (!consent) return undefined
  const { data, error } = await post(`/platform/telemetry/feature-flags/track`, { body })

  if (error) handleError(error)
  return data
}
