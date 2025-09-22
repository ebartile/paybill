import { API_URL, PageTelemetry } from '~/common'
import { useConsentToast } from '~/hooks/useConsentToast'
import GroupsTelemetry from './GroupsTelemetry'

export function Telemetry() {
  // Although this is "technically" breaking the rules of hooks
  // IS_PLATFORM never changes within a session, so this won't cause any issues
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { hasAcceptedConsent } = useConsentToast()

  return (
    <>
      <PageTelemetry
        API_URL={API_URL}
        hasAcceptedConsent={hasAcceptedConsent}
        enabled={true}
      />
      <GroupsTelemetry hasAcceptedConsent={hasAcceptedConsent} />
    </>
  )
}
