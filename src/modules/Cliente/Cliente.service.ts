import { Injectable } from "@nestjs/common";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { InicioService } from "../Flow/services/Inicio.service";
import { TipoStatus } from "src/common/enums/TipoStatus.enum";
import { CardapioService } from "../Flow/services/Cardapio.service";
import { FinalizarService } from "../Flow/services/Finalizar.service";
import { StatusService } from "../Status/Status.service";

@Injectable()
export class ClienteService {
    constructor(
        private readonly statusService: StatusService,
        private readonly inicioService: InicioService,
        private readonly cardapioService: CardapioService,
        private readonly finalizarService: FinalizarService
    ){}
    async startClientChat(Whatsapp: Whatsapp, Cliente: Message){
        const clienteStatus = this.statusService.getClienteStatus(Cliente.from)
        switch(clienteStatus.tipoStatus){
            case TipoStatus.INICIO:
                this.inicioService.iniciarTrocaMensagem(Whatsapp, Cliente)
                break;
            case TipoStatus.CARDAPIO:
                this.cardapioService.iniciarTrocaMensagem(Whatsapp, Cliente)
                break;
            case TipoStatus.FINALIZAR:
                this.finalizarService.iniciarTrocaMensagem(Whatsapp,Cliente)
                break;
            default:
                console.log("Erro")
        }
    }
}