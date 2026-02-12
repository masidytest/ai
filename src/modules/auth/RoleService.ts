// src/modules/auth/RoleService.ts

/**
 * RoleService manages roles, permissions, and user-role assignments in-memory.
 */
export class RoleService {
  private roles: Map<string, string[]> = new Map();
  private userRoles: Map<string, string> = new Map();

  constructor() {
    // Initialize default roles and permissions
    this.roles.set("user", ["read:self"]);
    this.roles.set("admin", ["read:any", "write:any", "delete:any"]);
  }

  /**
   * Define a new role or update an existing role's permissions.
   */
  defineRole(role: string, permissions: string[]): void {
    this.roles.set(role, permissions);
  }

  /**
   * Get all permissions for a given role.
   */
  getPermissionsForRole(role: string): string[] {
    return this.roles.get(role) || [];
  }

  /**
   * Assign a role to a user (overwrites any previous role).
   */
  assignRoleToUser(userId: string, role: string): void {
    if (!this.roles.has(role)) {
      throw new Error(`Role '${role}' is not defined.`);
    }
    this.userRoles.set(userId, role);
  }

  /**
   * Get the role assigned to a user.
   */
  getUserRole(userId: string): string | null {
    return this.userRoles.get(userId) || null;
  }

  /**
   * Check if a user has a specific permission.
   */
  userHasPermission(userId: string, permission: string): boolean {
    const role = this.getUserRole(userId);
    if (!role) return false;
    const permissions = this.getPermissionsForRole(role);
    return permissions.includes(permission);
  }
}
