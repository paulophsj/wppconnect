import { Injectable } from "@nestjs/common";
import { FlowHelperService } from "src/common/helpers/Flow.helper";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { TipoStatus } from "src/common/enums/TipoStatus.enum";

@Injectable()
export class InicioService {
    constructor(
        private readonly flowHelper: FlowHelperService,
    ) { }
    async iniciarTrocaMensagem(Whatsapp: Whatsapp, Cliente: Message) {
        const carrinhoCliente = this.flowHelper.obterCarrinho(Cliente.from) || []
        await this.flowHelper.iniciarInteracao(
            Whatsapp,
            Cliente,
            [
                "Seja bem vindo ao nosso Whatsapp integrado!",
                "Aqui você possui um sistema automatizado.",
                "Para inicar, selecione uma opção abaixo:"
            ],
            `1️⃣ Ver cardapio${carrinhoCliente.length > 0 ? "\n2️⃣ Finalizar pedido" : ""}\n\n9️⃣ Encerrar atendimento`,
            {
                1: TipoStatus.CARDAPIO,
                ...(carrinhoCliente.length > 0 ? { 2: TipoStatus.FINALIZAR } : {}),
                9: TipoStatus.ENCERRAR_ATENDIMENTO,
            }
        )
    }
}