import { Module } from "@nestjs/common";
import { StatusService } from "./Status.service";

@Module({
    imports: [],
    providers: [StatusService],
    exports: [StatusService]
})
export class StatusModule{}