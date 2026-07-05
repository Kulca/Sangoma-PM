import { execSync } from 'child_process';

const DB_PATH = process.env.TEAM_DB_PATH || '/home/team/.data/agent-team-ef814b89.db';

/**
 * Escape a single-quoted SQL value for use in a SQLite shell command.
 * Doubles single quotes and removes any non-printable characters.
 */
function escape(val: string): string {
  return val.replace(/'/g, "''").replace(/[^\x20-\x7E]/g, '');
}

/**
 * Run a SELECT query and return parsed JSON results.
 * Returns an empty array on error (caller should check error logs).
 */
export function query(sql: string): any[] {
  try {
    // Use heredoc to avoid shell escaping issues with complex SQL
    const output = execSync(`sqlite3 -json "${DB_PATH}" <<'EOSQL'\n${sql}\nEOSQL`).toString();
    return output ? JSON.parse(output) : [];
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
}

/**
 * Run an INSERT/UPDATE/DELETE statement.
 * Returns true on success, false on error.
 */
export function execute(sql: string): boolean {
  try {
    execSync(`sqlite3 "${DB_PATH}" <<'EOSQL'\n${sql}\nEOSQL`);
    return true;
  } catch (error) {
    console.error('Database execute error:', error);
    return false;
  }
}

/**
 * Insert a market proposal with proper escaping.
 */
export function insertProposal(id: string, userId: string, title: string, description: string, category: string): boolean {
  const sql = `INSERT INTO market_proposals (id, user_id, title, description, category, status, created_at) VALUES (
    '${escape(id)}',
    '${escape(userId)}',
    '${escape(title)}',
    '${escape(description)}',
    '${escape(category)}',
    'pending',
    datetime('now')
  )`;
  return execute(sql);
}
