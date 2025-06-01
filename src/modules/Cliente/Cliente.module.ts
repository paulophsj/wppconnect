import { ClienteService } from "src/modules/Cliente/Cliente.service";
import { forwardRef, Module } from "@nestjs/common";
import { FlowModule } from "../Flow/Flow.module";
import { StatusModule } from "../Status/Status.module";

@Module({
  imports: [StatusModule, forwardRef(() => FlowModule)],
    providers: [ClienteService],
    exports: [ClienteService]
})
export class ClienteModule{}