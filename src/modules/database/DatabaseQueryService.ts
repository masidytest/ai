// src/modules/database/DatabaseQueryService.ts
// Service for running SQL queries against a database (stub logic)

interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number; // ms
}

const mockQueryResults: Record<string, QueryResult> = {
  'SELECT * FROM users': {
    columns: ['id', 'name', 'email', 'created_at'],
    rows: [
      { id: '1', name: 'Alice', email: 'alice@example.com', created_at: '2024-01-01T00:00:00Z' },
      { id: '2', name: 'Bob', email: 'bob@example.com', created_at: '2024-01-02T00:00:00Z' },
    ],
    executionTime: 12,
  },
  'SELECT * FROM posts': {
    columns: ['id', 'user_id', 'title', 'content', 'created_at'],
    rows: [
      { id: '10', user_id: '1', title: 'Hello', content: 'World', created_at: '2024-01-03T00:00:00Z' },
    ],
    executionTime: 8,
  },
};

export class DatabaseQueryService {
  static async runQuery(databaseId: string, sql: string): Promise<QueryResult> {
    // Simulate execution time
    const start = Date.now();
    // Return mock data if available, else return a generic result
    const result = mockQueryResults[sql] || {
      columns: ['result'],
      rows: [{ result: 'Query executed (mock)' }],
      executionTime: 5,
    };
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, result.executionTime));
    return {
      ...result,
      executionTime: Date.now() - start,
    };
  }
}
