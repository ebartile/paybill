
export interface AvailableActionOptions {
  type?: 'new-data' | 'old-data';
  displayName?: string;
  aliases?: string[] | string;
  resource?: string;
  onNewRecord?: boolean;
  allowConfigureFields?: boolean;
}

export class ACLAvailableAction {
  constructor(public name: string, public options: AvailableActionOptions) {}
}
