// src/modules/database/DatabaseSchemaService.ts
// Service for managing and retrieving database schema information (stub logic)

interface Table {
  name: string;
  columns: string[];
}

interface Column {
  name: string;
  type: string;
  isNullable: boolean;
  isPrimary: boolean;
}

interface ForeignKey {
  column: string;
  referencesTable: string;
  referencesColumn: string;
}

const mockTables: Table[] = [
  { name: 'users', columns: ['id', 'name', 'email', 'created_at'] },
  { name: 'posts', columns: ['id', 'user_id', 'title', 'content', 'created_at'] },
];

const mockColumns: Record<string, Column[]> = {
  users: [
    { name: 'id', type: 'uuid', isNullable: false, isPrimary: true },
    { name: 'name', type: 'varchar', isNullable: false, isPrimary: false },
    { name: 'email', type: 'varchar', isNullable: false, isPrimary: false },
    { name: 'created_at', type: 'timestamp', isNullable: false, isPrimary: false },
  ],
  posts: [
    { name: 'id', type: 'uuid', isNullable: false, isPrimary: true },
    { name: 'user_id', type: 'uuid', isNullable: false, isPrimary: false },
    { name: 'title', type: 'varchar', isNullable: false, isPrimary: false },
    { name: 'content', type: 'text', isNullable: true, isPrimary: false },
    { name: 'created_at', type: 'timestamp', isNullable: false, isPrimary: false },
  ],
};

const mockForeignKeys: Record<string, ForeignKey[]> = {
  posts: [
    { column: 'user_id', referencesTable: 'users', referencesColumn: 'id' },
  ],
  users: [],
};

export class DatabaseSchemaService {
  static async getTables(databaseId: string): Promise<Table[]> {
    // Stub: return mock tables
    return mockTables;
  }

  static async getColumns(databaseId: string, tableName: string): Promise<Column[]> {
    // Stub: return mock columns for the table
    return mockColumns[tableName] || [];
  }

  static async getForeignKeys(databaseId: string, tableName: string): Promise<ForeignKey[]> {
    // Stub: return mock foreign keys for the table
    return mockForeignKeys[tableName] || [];
  }
}
