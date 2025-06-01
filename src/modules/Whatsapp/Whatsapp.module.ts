import { Module } from "@nestjs/common";
import { ClienteModule } from "../Cliente/Cliente.module";
import { FlowModule } from "../Flow/Flow.module";
import { WhatsappService } from "./Whatsapp.service";

@Module({
    imports: [ClienteModule, FlowModule],
    providers: [WhatsappService],
    exports: [WhatsappService]
})
export class WhatsappModule{}