import Database from 'better-sqlite3';

// SQLite 데이터베이스 파일 생성 및 연결
const db = new Database('scores.sqlite', { verbose: console.log });

// 초기 테이블 생성 (앱 시작 시 한 번만 실행)
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL,
contact TEXT NOT NULL,
score INTEGER NOT NULL,
xten INTEGER NOT NULL,
timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
