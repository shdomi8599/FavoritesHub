import { Module } from "@nestjs/common";
import { GPTService } from "./gpt.service";

@Module({
  imports: [],
  providers: [GPTService],
  exports: [GPTService],
})
export class GPTModule {}
