import { Injectable } from "@nestjs/common";
import { FlowHelperService } from "src/common/helpers/Flow.helper";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { TipoStatus } from "src/common/enums/TipoStatus.enum";
import { StatusService } from "src/modules/Status/Status.service";

@Injectable()
export class FinalizarService {
    constructor(
        private readonly statusService: StatusService,
        private readonly flowHelper: FlowHelperService,
    ) { }
    async iniciarTrocaMensagem(Whatsapp: Whatsapp, Cliente: Message) {
        const ClienteRecebeuMensagem = this.statusService.getClienteStatus(Cliente.from)
        const carrinhoCliente = this.flowHelper.obterCarrinho(Cliente.from) || []
        const opcoesPagamento =
            `1️⃣ - 💳 Cartão de crédito na entrega\n` +
            `2️⃣ - 💲 PIX\n` +
            `3️⃣ - 🪙 Pagar na entrega\n\n` +
            `9️⃣ - Encerrar atendimento`

        if (!ClienteRecebeuMensagem?.recebeuMensagem) {
            const mensagem_interacao =
                [
                    `💵 *Finalizar compra*\nSeus itens escolhidos foram:\n ${carrinhoCliente.map((produto) => `• ${produto}\n`)}`,
                    "Qual será sua forma de pagamento?"
                ]
            for (const mensagem of mensagem_interacao) {
                await Whatsapp.sendText(Cliente.from, mensagem)
            }
            await Whatsapp.sendText(Cliente.from, opcoesPagamento)
            return ClienteRecebeuMensagem.recebeuMensagem = true
        }

        //Formatar opcoesPagamento
        const opcoesPagamentoFormatado =
            opcoesPagamento.
                split("\n").
                map((elemento) => elemento.slice(9))
        const { body: mensagemCliente } = Cliente
        switch (Number(mensagemCliente)) {
            case 1:
            case 2:
                await Whatsapp.sendPixKey(Cliente.from, {
                    keyType: 'PHONE',
                    name: 'Paulo Henrique',
                    key: '+5581999866390',
                })
            case 3:
                await Whatsapp.sendText(Cliente.from, `Você selecionou a opção: *${opcoesPagamentoFormatado[Number(mensagemCliente) - 1]}*`)
                Cliente.body = "9"
                await this.flowHelper.iniciarInteracao(
                    Whatsapp,
                    Cliente,
                    [],
                    opcoesPagamento,
                    {
                        9: TipoStatus.ENCERRAR_ATENDIMENTO
                    }
                )
                return
            default:
                await this.flowHelper.iniciarInteracao(
                    Whatsapp,
                    Cliente,
                    [],
                    opcoesPagamento,
                    {
                        9: TipoStatus.ENCERRAR_ATENDIMENTO
                    }
                )
                return
        }
    }
}