import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739197429607 implements MigrationInterface {
    name = 'Migration1739197429607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`presets\` DROP COLUMN \`defaultPreset\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`presets\` ADD \`defaultPreset\` tinyint NOT NULL DEFAULT '0'`);
    }

}
