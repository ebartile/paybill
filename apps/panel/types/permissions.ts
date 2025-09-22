import jsonLogic from 'json-logic-js'

// TODO: add more permissions as needed
export declare enum PermissionAction {
    ANALYTICS_ADMIN_READ = "analytics:Admin:Read",
    ANALYTICS_ADMIN_WRITE = "analytics:Admin:Write",
    ANALYTICS_READ = "analytics:Read",
    ANALYTICS_WRITE = "analytics:Write",
    AUTH_EXECUTE = "auth:Execute",
    BILLING_READ = "billing:Read",
    BILLING_WRITE = "billing:Write",
    CREATE = "write:Create",
    DELETE = "write:Delete",
    READ = "read:Read",
    SECRETS_READ = "secrets:Read",
    SECRETS_WRITE = "secrets:Write",
    STORAGE_ADMIN_READ = "storage:Admin:Read",
    STORAGE_ADMIN_WRITE = "storage:Admin:Write",
    STORAGE_READ = "storage:Read",
    STORAGE_WRITE = "storage:Write",
    REPLICATION_ADMIN_READ = "replication:Admin:Read",
    REPLICATION_ADMIN_WRITE = "replication:Admin:Write",
    UPDATE = "write:Update"
}

export interface Permission {
  actions: PermissionAction[]
  condition: jsonLogic.RulesLogic
  organization_slug: string
  resources: string[]
  restrictive?: boolean
  project_refs: string[]
}

export interface Role {
  id: number
  name: string
}

export declare enum OAuthScope {
    ANALYTICS_READ = "analytics:read",
    ANALYTICS_WRITE = "analytics:write",
    AUTH_READ = "auth:read",
    AUTH_WRITE = "auth:write",
    DATABASE_READ = "database:read",
    DATABASE_WRITE = "database:write",
    DOMAINS_READ = "domains:read",
    DOMAINS_WRITE = "domains:write",
    EDGE_FUNCTIONS_READ = "edge_functions:read",
    EDGE_FUNCTIONS_WRITE = "edge_functions:write",
    ENVIRONMENT_READ = "environment:read",
    ENVIRONMENT_WRITE = "environment:write",
    ORGANIZATIONS_READ = "organizations:read",
    ORGANIZATIONS_WRITE = "organizations:write",
    PROJECTS_READ = "projects:read",
    PROJECTS_WRITE = "projects:write",
    REST_READ = "rest:read",
    REST_WRITE = "rest:write",
    SECRETS_READ = "secrets:read",
    SECRETS_WRITE = "secrets:write",
    STORAGE_READ = "storage:read",
    STORAGE_WRITE = "storage:write"
}
