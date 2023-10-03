import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1696139824306 implements MigrationInterface {
  name = "Migration1696139824306";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mail\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`lastLogin\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_2e5b50f4b7c081eceea476ad12\` (\`mail\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`presets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`presetName\` varchar(255) NOT NULL, \`userId\` int NULL, INDEX \`IDX_7bd663a558ec85144fe51d9c2f\` (\`presetName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`favorites\` (\`id\` int NOT NULL AUTO_INCREMENT, \`favoriteName\` varchar(255) NOT NULL, \`domain\` varchar(255) NOT NULL, \`route\` varchar(255) NOT NULL, \`presetId\` int NULL, INDEX \`IDX_fed65312e52baf4e4f20c95e75\` (\`favoriteName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`presets\` ADD CONSTRAINT \`FK_ae4b633aa4682700fe0745fb5ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorites\` ADD CONSTRAINT \`FK_9ca293cb7f02f39f9e2559aed7d\` FOREIGN KEY (\`presetId\`) REFERENCES \`presets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`favorites\` DROP FOREIGN KEY \`FK_9ca293cb7f02f39f9e2559aed7d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`presets\` DROP FOREIGN KEY \`FK_ae4b633aa4682700fe0745fb5ed\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fed65312e52baf4e4f20c95e75\` ON \`favorites\``,
    );
    await queryRunner.query(`DROP TABLE \`favorites\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7bd663a558ec85144fe51d9c2f\` ON \`presets\``,
    );
    await queryRunner.query(`DROP TABLE \`presets\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2e5b50f4b7c081eceea476ad12\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
