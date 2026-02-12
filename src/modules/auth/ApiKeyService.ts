// src/modules/auth/ApiKeyService.ts

import { v4 as uuidv4 } from 'uuid';
import { User, users } from './UserModel';

export interface ApiKey {
  id: string;
  userId: string;
  key: string;
  createdAt: Date;
  revoked: boolean;
}

/**
 * ApiKeyService manages API key creation, listing, revocation, and validation in-memory.
 */
export class ApiKeyService {
  private apiKeys: ApiKey[] = [];

  /**
   * Create a new API key for a user.
   */
  createApiKey(userId: string): ApiKey {
    const apiKey: ApiKey = {
      id: uuidv4(),
      userId,
      key: uuidv4(),
      createdAt: new Date(),
      revoked: false,
    };
    this.apiKeys.push(apiKey);
    return apiKey;
  }

  /**
   * List all API keys for a user.
   */
  listApiKeys(userId: string): ApiKey[] {
    return this.apiKeys.filter(k => k.userId === userId);
  }

  /**
   * Revoke an API key by its id.
   */
  revokeApiKey(keyId: string): void {
    const key = this.apiKeys.find(k => k.id === keyId);
    if (key) {
      key.revoked = true;
    }
  }

  /**
   * Validate an API key string and return the associated user if valid and not revoked.
   */
  validateApiKey(key: string): User | null {
    const apiKey = this.apiKeys.find(k => k.key === key && !k.revoked);
    if (!apiKey) return null;
    return users.find(u => u.id === apiKey.userId) || null;
  }
}
