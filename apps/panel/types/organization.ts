import { components } from "~/common";
import { PlanId } from "./subscriptions";

export type OrganizationBase = components['schemas']['OrganizationResponse']

export interface Organization extends OrganizationBase {
  managed_by: 'paybill' | 'vercel-marketplace' | 'aws-marketplace'
  partner_id?: string
  plan: { id: PlanId; name: string }
}

export type CustomerAddress = NonNullable<components['schemas']['CustomerResponse']['address']>
export type CustomerTaxId = NonNullable<components['schemas']['TaxIdResponse']['tax_id']>
