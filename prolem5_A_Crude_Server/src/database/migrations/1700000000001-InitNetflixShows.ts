import { MigrationInterface, QueryRunner } from "typeorm";

export class InitNetflixShows1700000000001 implements MigrationInterface {
  name = 'InitNetflixShows1700000000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS netflix_shows (
        show_id TEXT PRIMARY KEY,
        type TEXT,
        title TEXT,
        director TEXT,
        cast_members TEXT,
        country TEXT,
        date_added DATE,
        release_year INTEGER,
        rating TEXT,
        duration TEXT,
        listed_in TEXT,
        description TEXT
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE netflix_shows;
    `);
  }
}
