import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'toram-data.db')
if (!fs.existsSync(dbPath)) {
  console.error('DB not found at', dbPath)
  process.exit(1)
}

const db = new sqlite3.Database(dbPath)

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

;(async () => {
  try {
    const tables = await all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    )
    for (const { name } of tables) {
      console.log(`\n=== TABLE: ${name} ===`)
      const cols = await all(`PRAGMA table_info(${name})`)
      console.log('Columns:', cols.map((c) => c.name).join(', '))
      const sample = await all(`SELECT * FROM ${name} LIMIT 2`)
      console.log('Sample rows:', JSON.stringify(sample, null, 2))
    }
  } catch (e) {
    console.error('Error inspecting DB:', e)
  } finally {
    db.close()
  }
})()
