import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { FlowHelperService } from "src/common/helpers/Flow.helper";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { TipoStatus } from "src/common/enums/TipoStatus.enum";
import { ClienteService } from "src/modules/Cliente/Cliente.service";
import { StatusService } from "src/modules/Status/Status.service";

@Injectable()
export class CardapioService {
    constructor(
        private readonly flowHelper: FlowHelperService,
        private readonly statusService: StatusService
    ) { }

    async iniciarTrocaMensagem(Whatsapp: Whatsapp, Cliente: Message) {
        const ClienteRecebeuMensagem = this.statusService.getClienteStatus(Cliente.from)
        const carrinhoCliente = this.flowHelper.obterCarrinho(Cliente.from) || [];

        // Montar mensagem do cardápio
        const mensagemSabores =
            `${carrinhoCliente.length > 0 ? "🛒 *Carrinho de compras*\n" +
                carrinhoCliente.map((produto) => `• ${produto}\n`).join("") + "\n" : ""}` +
            `🍔 *1️⃣ Clássico da Casa*\n` +
            `Pão, hambúrguer artesanal 150g, queijo cheddar, alface, tomate e maionese especial.\n\n` +
            `🍔 *2️⃣ Bacon Supremo*\n` +
            `Hambúrguer suculento com bacon crocante, queijo prato, cebola caramelizada e molho barbecue.\n\n` +
            `🍔 *3️⃣ Picante Mexicano*\n` +
            `Hambúrguer com queijo pepper jack, jalapeños, guacamole, alface e molho chipotle.\n\n` +
            `🍔 *4️⃣ Veggie Delight*\n` +
            `Hambúrguer vegetal, queijo vegano, tomate, rúcula e maionese de alho poró.\n\n` +
            `5️⃣ Voltar ao menu anterior` +
            `${carrinhoCliente.length > 0 ? "\n6️⃣ Finalizar pedido" : ""}` + 
            `\n\n9️⃣ Encerrar atendimento`;

        //Caso o cliente ainda não tenha recebido as mensagens iniciais - Resultado do atributo || clienteService ||
        //Ele envia a interação
        if (!ClienteRecebeuMensagem?.recebeuMensagem) {
            const mensagem_interacao = [
                `Aqui você está no cardápio.\nVocê pode escolher qual produto irá comprar.`,
                `Selecione uma opção abaixo`
            ]
            for (const mensagem of mensagem_interacao) {
                await Whatsapp.sendText(Cliente.from, mensagem)
            }
            await Whatsapp.sendText(Cliente.from, mensagemSabores)
            return ClienteRecebeuMensagem.recebeuMensagem = true
        }

        //Caso ele já tenha recebido a interação inicial, segue para lógica de opções 
        const mensagemSaboresNames = mensagemSabores
            .split("🍔")
            .slice(1)
            .map((elemento) => elemento.slice(5)
                .trim()
                .split("*\n")[0])
                
        const { body: mensagemCliente } = Cliente
        switch (Number(mensagemCliente)) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.flowHelper.adicionarProdutoAoCarrinho(Cliente.from, mensagemSaboresNames[Number(mensagemCliente) - 1])
                await Whatsapp.sendText(Cliente.from, `✅ *${mensagemSaboresNames[Number(mensagemCliente) - 1]}* adicionado ao carrinho!`)
                return
            case 5:
                Cliente.body = "5"
                await this.flowHelper.iniciarInteracao(
                    Whatsapp,
                    Cliente,
                    [],
                    "",
                    {
                        5: TipoStatus.INICIO
                    }
                )
                return
            case 6:
                if (carrinhoCliente.length > 0) {
                    Cliente.body = "6"
                    await this.flowHelper.iniciarInteracao(
                        Whatsapp,
                        Cliente,
                        [],
                        "",
                        {
                            6: TipoStatus.FINALIZAR
                        }
                    )
                    return
                }
                else {
                    await Whatsapp.sendText(Cliente.from, "❌ Você ainda não possui itens no carrinho.")
                    return
                }
            default:
                await this.flowHelper.iniciarInteracao(
                    Whatsapp,
                    Cliente,
                    [],
                    mensagemSabores,
                    {
                        9: TipoStatus.ENCERRAR_ATENDIMENTO
                    }
                )
                return

        }
    }
}