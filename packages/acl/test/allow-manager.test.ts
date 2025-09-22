import { ACL } from "../src";

describe('AllowManager tests', () => {
  let acl: ACL;

  beforeEach(() => {
    acl = new ACL();
  });

  it('should allow a specific resource and action', async () => {
    acl.allowManager.allow('documents', 'read');

    expect(await acl.allowManager.isAllowed('documents', 'read', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'write', {})).toBeFalsy();
    expect(await acl.allowManager.isAllowed('users', 'read', {})).toBeFalsy();
  });

  it('should allow multiple actions for a single resource', async () => {
    acl.allowManager.allow('documents', 'read');
    acl.allowManager.allow('documents', 'write');

    expect(await acl.allowManager.isAllowed('documents', 'read', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'write', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'delete', {})).toBeFalsy();
  });

  it('should allow all resources using "*" wildcard', async () => {
    acl.allowManager.allow('*', 'read');

    expect(await acl.allowManager.isAllowed('documents', 'read', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('users', 'read', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('users', 'write', {})).toBeFalsy();
  });

  it('should allow action with a condition function', async () => {
    acl.allowManager.allow('documents', 'edit', (ctx) => ctx.user === 'admin');

    expect(await acl.allowManager.isAllowed('documents', 'edit', { user: 'admin' })).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'edit', { user: 'guest' })).toBeFalsy();
  });

  it('should allow action with a registered named condition', async () => {
    acl.allowManager.registerAllowCondition('isAdmin', (ctx) => ctx.user === 'admin');
    acl.allowManager.allow('settings', 'update', 'isAdmin');

    expect(await acl.allowManager.isAllowed('settings', 'update', { user: 'admin' })).toBeTruthy();
    expect(await acl.allowManager.isAllowed('settings', 'update', { user: 'guest' })).toBeFalsy();
  });

  it('should return false for unknown resource or action', async () => {
    expect(await acl.allowManager.isAllowed('unknown', 'read', {})).toBeFalsy();
    expect(await acl.allowManager.isAllowed('documents', 'unknown', {})).toBeFalsy();
  });

  it('should combine global "*" and resource-specific actions', async () => {
    acl.allowManager.allow('*', 'read');
    acl.allowManager.allow('documents', 'write');

    expect(await acl.allowManager.isAllowed('documents', 'read', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'write', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('users', 'read', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('users', 'write', {})).toBeFalsy();
  });

  it('should handle multiple conditions for a single action', async () => {
    acl.allowManager.allow('documents', 'delete', (ctx) => ctx.owner);
    acl.allowManager.allow('documents', 'delete', 'public');

    // Either condition being true allows access
    expect(await acl.allowManager.isAllowed('documents', 'delete', { owner: true })).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'delete', {})).toBeTruthy();
    expect(await acl.allowManager.isAllowed('documents', 'delete', { owner: false })).toBeTruthy();
  });

  // --- allowConfigure tests ---
  it('should allowConfigure for a role with allowConfigure strategy', async () => {
    acl.define({
      role: 'admin',
      strategy: { allowConfigure: true },
    });

    acl.setCurrentRole('admin');
    acl.allowManager.allow('settings', 'update', 'allowConfigure');

    expect(await acl.allowManager.isAllowed('settings', 'update', {})).toBeTruthy();
  });

  it('should not allowConfigure for a role without allowConfigure strategy', async () => {
    acl.define({
      role: 'user',
      strategy: { allowConfigure: false },
    });

    acl.setCurrentRole('user');
    acl.allowManager.allow('settings', 'update', 'allowConfigure');

    expect(await acl.allowManager.isAllowed('settings', 'update', {})).toBeFalsy();
  });

  it('should not allowConfigure when no role is set', async () => {
    acl.setCurrentRole(undefined);
    acl.allowManager.allow('settings', 'update', 'allowConfigure');

    expect(await acl.allowManager.isAllowed('settings', 'update', {})).toBeFalsy();
  });

  it('should not allowConfigure for non-existent role', async () => {
    acl.setCurrentRole('ghost');
    acl.allowManager.allow('settings', 'update', 'allowConfigure');

    expect(await acl.allowManager.isAllowed('settings', 'update', {})).toBeFalsy();
  });
});
