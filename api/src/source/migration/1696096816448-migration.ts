import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696096816448 implements MigrationInterface {
  name = "Migration1696096816448";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`favorites\` (\`id\` int NOT NULL AUTO_INCREMENT, \`domain\` varchar(255) NOT NULL, \`route\` varchar(255) NOT NULL, \`presetId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mail\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`lastLogin\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_2e5b50f4b7c081eceea476ad12\` (\`mail\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`presets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`presetName\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorites\` ADD CONSTRAINT \`FK_9ca293cb7f02f39f9e2559aed7d\` FOREIGN KEY (\`presetId\`) REFERENCES \`presets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`presets\` ADD CONSTRAINT \`FK_ae4b633aa4682700fe0745fb5ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`presets\` DROP FOREIGN KEY \`FK_ae4b633aa4682700fe0745fb5ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorites\` DROP FOREIGN KEY \`FK_9ca293cb7f02f39f9e2559aed7d\``,
    );
    await queryRunner.query(`DROP TABLE \`presets\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2e5b50f4b7c081eceea476ad12\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`favorites\``);
  }
}
