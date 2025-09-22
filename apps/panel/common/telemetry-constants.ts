/**
 * Consolidated event definitions coming from the frontend, including studio, www, and docs.
 *
 * Note that events are not emitted for users that have opted out of telemetry.
 *
 * @module telemetry-frontend
 */

type TelemetryGroups = {
  project: string
  organization: string
}

/**
 * Triggered when a user signs up. When signing up with Email and Password, this is only triggered once user confirms their email.
 *
 * @group Events
 * @source studio
 * @page /sign-up
 */
export interface SignUpEvent {
  action: 'sign_up'
  properties: {
    category: 'conversion'
  }
}

/**
 * A feature preview was disabled by the user through the FeaturePreviewModal.
 *
 * The FeaturePreviewModal can be opened clicking at the profile icon at the bottom left corner of the project sidebar.
 *
 * @group Events
 * @source studio
 */
export interface FeaturePreviewDisabledEvent {
  action: 'feature_preview_disabled'
  properties: {
    /**
     * Feature key of the preview that was disabled. e.g. supabase-ui-api-side-panel
     */
    feature: string
  }
  groups: TelemetryGroups
}

/**
 * A feature preview was enabled by the user through the FeaturePreviewModal.
 *
 * The FeaturePreviewModal can be opened clicking at the profile icon at the bottom left corner of the project sidebar.
 *
 * @group Events
 * @source studio
 */
export interface FeaturePreviewEnabledEvent {
  action: 'feature_preview_enabled'
  properties: {
    /**
     * Feature key of the preview that was enabled. e.g. supabase-ui-api-side-panel
     */
    feature: string
  }
  groups: TelemetryGroups
}

/**
 * Triggered when a user signs in with Github, Email and Password or SSO.
 *
 * Some unintuitive behavior:
 *   - If signing up with GitHub the SignInEvent gets triggered first before the SignUpEvent.
 *
 * @group Events
 * @source studio
 * @page /sign-in-mfa
 */
export interface SignInEvent {
  action: 'sign_in'
  properties: {
    category: 'account'
    /**
     * The method used to sign in, e.g. email, github, sso
     */
    method: string
  }
}

/**
 * Triggered when the organization MFA enforcement setting is updated.
 *
 * @group Events
 * @source studio
 * @page /dashboard/org/{slug}/security
 */
export interface OrganizationMfaEnforcementUpdated {
  action: 'organization_mfa_enforcement_updated'
  properties: {
    mfaEnforced: boolean
  }
  groups: Omit<TelemetryGroups, 'project'>
}

/**
 * @hidden
 */
export type TelemetryEvent =
  | SignUpEvent
  | SignInEvent
  | FeaturePreviewEnabledEvent
  | FeaturePreviewDisabledEvent
  | OrganizationMfaEnforcementUpdated
