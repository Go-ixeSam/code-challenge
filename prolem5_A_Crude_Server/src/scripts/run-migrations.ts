import DataSource from '../../typeorm.config'

async function runMigrations() {
  try {
    console.log("📦 Running migrations...");
    await DataSource.initialize();
    await DataSource.runMigrations();
    console.log("✅ Migrations completed!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await DataSource.destroy();
    process.exit();
  }
}

runMigrations();
