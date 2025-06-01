import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { ClienteService } from "src/modules/Cliente/Cliente.service";
import { OpcaoMenu } from "../interfaces/OpcaoMenu.interface";
import { StatusService } from "src/modules/Status/Status.service";

@Injectable()
export class FlowHelperService {
  private produtosCarrinhos: Map<string, string[]> = new Map()

  constructor(
    private readonly statusService: StatusService,
    @Inject(forwardRef(() => ClienteService))
    private readonly clienteService: ClienteService
    /**
     * 
     * FlowHelperService depende de ClienteService
     * ClienteService depende de InicioService, CardapioService, FinalizarService
     * Esses, por sua vez, usam FlowHelperService
     * 
     */
  ) { }
  async iniciarInteracao(
    Whatsapp: Whatsapp,
    Cliente: Message,
    mensagem_interacao: string[],
    mensagem_opcao: string,
    menu: OpcaoMenu,
    mensagem_default: string = "Desculpe. Não consegui entender sua opção. Digite uma opção válida."
  ) {
    const ClienteStatus = this.statusService.getClienteStatus(Cliente.from)

    //Caso o cliente não tenha recebido a mensagem inicial
    if (!ClienteStatus.recebeuMensagem && mensagem_interacao.length > 0) {
      for (const mensagem of mensagem_interacao) {
        await Whatsapp.sendText(Cliente.from, mensagem)
      }
      await Whatsapp.sendText(Cliente.from, mensagem_opcao)
      return ClienteStatus.recebeuMensagem = true;
    }
    else {
      ClienteStatus.recebeuMensagem = false;
    }

    //Caso o cliente já tenha recebido a mensagem inicial
    const { body: mensagemCliente } = Cliente
    switch (Number(mensagemCliente)) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        if (menu[Number(mensagemCliente)] !== undefined) {
          ClienteStatus.tipoStatus = menu[Number(mensagemCliente)];
          ClienteStatus.recebeuMensagem = false;
          return this.clienteService.startClientChat(Whatsapp, Cliente);
        }
      case 9:
        this.statusService.removeClienteStatus(Cliente.from)
        this.produtosCarrinhos.delete(Cliente.from)
        await Whatsapp.sendText(Cliente.from, "Muito obrigado por ter entrado em contato conosco! Até a próxima.")
        return
      default:
        await Whatsapp.sendText(Cliente.from, mensagem_default);
        await Whatsapp.sendText(Cliente.from, mensagem_opcao)
        ClienteStatus.recebeuMensagem = true
        break;
    }
  }
  adicionarProdutoAoCarrinho(Cliente: string, produto: string): void {
    const carrinho = this.produtosCarrinhos.get(Cliente) || [];
    carrinho.push(produto);
    this.produtosCarrinhos.set(Cliente, carrinho);
  }
  obterCarrinho(Cliente: string): string[] {
    return this.produtosCarrinhos.get(Cliente)!
  }
}
