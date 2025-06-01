import { forwardRef, Module } from "@nestjs/common";
import { FlowHelperService } from "src/common/helpers/Flow.helper";
import { InicioService } from "./services/Inicio.service";
import { CardapioService } from "./services/Cardapio.service";
import { FinalizarService } from "./services/Finalizar.service";
import { StatusModule } from "../Status/Status.module";
import { ClienteModule } from "../Cliente/Cliente.module";

@Module({
  imports: [StatusModule, forwardRef(() => ClienteModule)],
    providers: [FlowHelperService, InicioService, CardapioService, FinalizarService],
    exports: [FlowHelperService, InicioService, CardapioService, FinalizarService]
})
export class FlowModule{}