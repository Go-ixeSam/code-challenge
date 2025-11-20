import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import DataSource from '../../../typeorm.config';

async function runSeed() {
  try {
    console.log("🔄 Connecting to DB...");
    await DataSource.initialize();

    console.log("🧹 Clearing database...");
    await DataSource.query(`SET session_replication_role = replica;`);
    const tables = await DataSource.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `);

    for (const t of tables) {
      if (t.tablename === 'migrations') continue;
      console.log(`   → Truncate: ${t.tablename}`);
      await DataSource.query(`TRUNCATE TABLE "${t.tablename}" RESTART IDENTITY CASCADE`);
    }

    await DataSource.query(`SET session_replication_role = DEFAULT;`);
    await DataSource.destroy();
    console.log("🧽 DB cleaned!");

    // =============================
    // RUN PSQL WITH RAW FILE
    // =============================

    const sqlPath = path.join(__dirname, '..', 'dumps', 'netflix.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("🚀 Executing SQL via psql (docker exec)...");
    const container = process.env.POSTGRES_CONTAINER || 'netflix_postgres';

    await new Promise<void>((resolve, reject) => {
      const child = spawn('docker', [
        'exec', '-i',
        container,
        'psql',
        '-U', 'postgres',
        '-d', 'netflix'
      ]);

      child.stdin.write(sql);
      child.stdin.end();

      child.stdout.on('data', d => process.stdout.write(d));
      child.stderr.on('data', d => process.stderr.write(d));

      child.on('close', code => {
        if (code === 0) resolve();
        else reject(`psql exited with code ${code}`);
      });
    });

    console.log("✅ Seed completed!");

  } catch (err) {
    console.error("❌ Seed failed:", err);
  }
}

runSeed();
