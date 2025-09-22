import { ACL } from "../src";

describe('acl', () => {
  let acl: ACL;

  beforeEach(() => {
    acl = new ACL({ currentUser: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91', currentRole: 'admin' });
  });

  it('should grant action with own params', () => {
    acl.setAvailableAction('edit', { type: 'old-data' });
    acl.setAvailableAction('create', { type: 'new-data' });

    acl.define({
      role: 'admin',
      actions: {
        'posts:edit': { own: true },
      },
    });

    let canResult = acl.can({ role: 'admin', resource: 'posts', action: 'edit' });

    expect(canResult).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'edit',
      params: { filter: { createdById: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } },
    });
  });

  it('should getRole', () => {
    const role = acl.define({
      role: 'admin',
      actions: { 'posts:edit': { own: true } },
    });
    expect(acl.getRole('admin')).toBe(role);
  });

  it('should set available action', () => {
    acl.setAvailableAction('edit', { displayName: 'Edit' });
    const action = acl.getAvailableAction('edit');
    expect(action.name).toBe('edit');
  });

  it('should define role with predicate', () => {
    acl.setAvailableAction('edit', { type: 'old-data' });
    acl.setAvailableAction('create', { type: 'new-data' });

    acl.define({
      role: 'admin',
      strategy: { actions: ['edit:own', 'create'] },
    });

    let canResult = acl.can({ role: 'admin', resource: 'posts', action: 'edit' });

    expect(canResult).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'edit',
      params: { filter: { createdById: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } },
    });
  });

  it('should allow all', () => {
    acl.setAvailableAction('create', { type: 'new-data' });
    acl.setAvailableAction('edit', { type: 'old-data' });
    acl.setAvailableStrategy('s1', { displayName: 's1', actions: '*' });

    acl.define({ role: 'admin', strategy: 's1' });

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'create',
    });
  });

  it('should deny all', () => {
    acl.setAvailableStrategy('s1', { displayName: 'test', actions: false });

    acl.define({ role: 'admin', strategy: 's1' });

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toBeNull();
  });

  it('should grant action when define role', () => {
    acl.setAvailableAction('create', { displayName: 'create', type: 'new-data' });
    acl.setAvailableStrategy('s1', { displayName: 'test', actions: false });

    acl.define({
      role: 'admin',
      strategy: 's1',
      actions: { 'posts:create': {} },
    });

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'create',
    });
  });

  it('should grant action after grantAction', () => {
    acl.setAvailableAction('create', { displayName: 'create', type: 'new-data' });
    acl.setAvailableStrategy('s1', { displayName: 'test', actions: false });

    const role = acl.define({ role: 'admin', strategy: 's1' });

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toBeNull();

    role.grantAction('posts:create', {});

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'create',
    });
  });

  it('should work with alias action', () => {
    acl.setAvailableAction('view', { displayName: 'view', type: 'new-data', aliases: ['get', 'list'] });
    acl.setAvailableStrategy('s1', { displayName: 'test', actions: ['view'] });

    acl.define({ role: 'admin', strategy: 's1' });

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'get' })).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'get',
    });
    expect(acl.can({ role: 'admin', resource: 'posts', action: 'list' })).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'list',
    });
  });

  it('should return action params when check permission', () => {
    acl.setAvailableStrategy('s2', { displayName: 'view create update', actions: ['view', 'create', 'update'] });
    acl.setAvailableAction('view', { type: 'new-data' });
    acl.setAvailableAction('create', { type: 'new-data' });
    acl.setAvailableAction('update', { type: 'new-data' });

    acl.define({
      role: 'admin',
      strategy: 's2',
      actions: { 'posts:view': { filter: { createdById: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } } },
    });

    let canResult = acl.can({ role: 'admin', resource: 'posts', action: 'view' });

    expect(canResult).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'view',
      params: { filter: { createdById: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } },
    });
  });

  it('should getActionParams', () => {
    acl.setAvailableStrategy('s2', { displayName: 'view create update', actions: ['view', 'create', 'update'] });
    acl.setAvailableAction('view', { type: 'new-data' });

    const role = acl.define({
      role: 'admin',
      strategy: 's2',
      actions: { 'posts:view': { filter: { createdById: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } } },
    });

    const params = role.getActionParams('posts:view');
    expect(params).toMatchObject({ filter: { createdById: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } });
  });

  it('should revoke action', () => {
    acl.setAvailableAction('create', { displayName: 'create', type: 'new-data' });
    acl.setAvailableStrategy('s1', { displayName: 'test', actions: false });

    const role = acl.define({ role: 'admin', strategy: 's1' });
    role.grantAction('posts:create', {});

    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'create',
    });

    role.revokeAction('posts:create');
    expect(acl.can({ role: 'admin', resource: 'posts', action: 'create' })).toBeNull();
  });

  it('should call beforeGrantAction', () => {
    acl.setAvailableAction('create', { type: 'old-data' });

    acl.beforeGrantAction((ctx) => {
      if (ctx.path === 'posts:create') {
        ctx.params = { filter: { status: 'publish' } };
      }
    });

    acl.define({ role: 'admin', actions: { 'posts:create': {} } });

    const results = acl.can({ role: 'admin', resource: 'posts', action: 'create' });
    expect(results).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'create',
      params: { filter: { status: 'publish' } },
    });
  });

  it('should to JSON', () => {
    acl.setAvailableAction('create', { displayName: 'create', type: 'new-data' });
    acl.setAvailableStrategy('s1', { displayName: 'test', actions: false });

    const role = acl.define({
      role: 'admin',
      strategy: 's1',
      actions: { 'posts:create': { filter: { a: 'b' } } },
    });

    const roleJSON = role.toJSON();
    expect(roleJSON).toMatchObject({
      role: 'admin',
      strategy: 's1',
      actions: { 'posts:create': {} },
    });
  });

  it('should not allow when strategyResources is set', async () => {
    acl.setAvailableAction('create', { displayName: 'create', type: 'new-data' });

    acl.define({ role: 'admin', strategy: { actions: ['create'] } });

    expect(acl.can({ role: 'admin', resource: 'users', action: 'create' })).toBeTruthy();

    acl.setStrategyResources(['posts']);
    expect(acl.can({ role: 'admin', resource: 'users', action: 'create' })).toBeNull();

    acl.setStrategyResources(['posts', 'users']);
    expect(acl.can({ role: 'admin', resource: 'users', action: 'create' })).toBeTruthy();
  });

  it('should run beforeGrantAction when granting an action', () => {
    // Define the action first
    acl.setAvailableAction('update', { type: 'old-data' });

    // Add a beforeGrantAction listener that modifies params
    acl.beforeGrantAction((ctx) => {
      if (ctx.path === 'posts:update') {
        ctx.params = { filter: { status: 'approved', updatedBy: acl.getCurrentUser() } };
      }
    });

    // Define role without explicit params
    const role = acl.define({ role: 'admin', actions: { 'posts:update': {} } });

    // Call can() should apply the listener automatically
    const result = acl.can({ role: 'admin', resource: 'posts', action: 'update' });

    expect(result).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'update',
      params: { filter: { status: 'approved', updatedBy: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } },
    });
  });

  it('should also apply beforeGrantAction when grantAction is called after role creation', () => {
    acl.setAvailableAction('publish', { type: 'old-data' });

    acl.beforeGrantAction((ctx) => {
      if (ctx.path === 'posts:publish') {
        ctx.params = { filter: { publishedBy: acl.getCurrentUser() } };
      }
    });

    const role = acl.define({ role: 'admin', actions: {} });

    // Grant action manually
    role.grantAction('posts:publish', {});

    const result = acl.can({ role: 'admin', resource: 'posts', action: 'publish' });

    expect(result).toMatchObject({
      role: 'admin',
      resource: 'posts',
      action: 'publish',
      params: { filter: { publishedBy: 'd6f8c3a2-1b5e-4f7a-9f3d-2e7b6c4d8a91' } },
    });
  });

});
