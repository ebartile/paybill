
import { ACL } from './acl';

export type ConditionFunc = (ctx: any) => Promise<boolean> | boolean;

export class AllowManager {
  protected skipActions = new Map<string, Map<string, string | ConditionFunc | true>>();

  protected registeredCondition = new Map<string, ConditionFunc>();

  constructor(public acl: ACL) {
    this.registerAllowCondition('loggedIn', (ctx) => {
      return !!this.acl.getCurrentUser();
    });

    this.registerAllowCondition('public', (ctx) => {
      return true;
    });

    this.registerAllowCondition('allowConfigure', async (ctx) => {
      const roleName = this.acl.getCurrentRole();
      if (!roleName) {
        return false;
      }

      const role = this.acl.getRole(roleName);
      if (!role) {
        return false;
      }

      return role.getStrategy()?.allowConfigure;
    });
  }

  allow(resourceName: string, actionName: string, condition?: string | ConditionFunc) {
    const actionMap = this.skipActions.get(resourceName) || new Map<string, string | ConditionFunc>();
    actionMap.set(actionName, condition || true);

    this.skipActions.set(resourceName, actionMap);
  }

  getAllowedConditions(resourceName: string, actionName: string): Array<ConditionFunc | true> {
    const fetchActionSteps: string[] = ['*', resourceName];

    const results = [];

    for (const fetchActionStep of fetchActionSteps) {
      const resource = this.skipActions.get(fetchActionStep);
      if (resource) {
        for (const fetchActionStep of ['*', actionName]) {
          const condition = resource.get(fetchActionStep);
          if (condition) {
            results.push(typeof condition === 'string' ? this.registeredCondition.get(condition) : condition);
          }
        }
      }
    }

    return results;
  }

  registerAllowCondition(name: string, condition: ConditionFunc) {
    this.registeredCondition.set(name, condition);
  }

  async isAllowed(resourceName: string, actionName: string, ctx: any) {
    const skippedConditions = this.getAllowedConditions(resourceName, actionName);

    for (const skippedCondition of skippedConditions) {
      if (skippedCondition) {
        let skipResult = false;

        if (typeof skippedCondition === 'function') {
          skipResult = await skippedCondition(ctx);
        } else if (skippedCondition) {
          skipResult = true;
        }

        if (skipResult) {
          return true;
        }
      }
    }

    return false;
  }
}
