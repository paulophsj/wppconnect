import { Injectable } from "@nestjs/common";
import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import { ClienteService } from "../Cliente/Cliente.service";

@Injectable()
export class WhatsappService {
    private Whatsapp: Whatsapp
    constructor(
        private readonly clienteService: ClienteService
    ) { }

    async createConnection() {
        this.Whatsapp = await create({
            session: 'paulo-henrique', //Nome da sua sessão.
            catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
                console.log('Terminal qrcode: ', asciiQR);
            }
        })
        return this.startClientService(this.Whatsapp)
    }
    private async startClientService(Whatsapp: Whatsapp) {
        this.Whatsapp.onMessage((Cliente) => {
            if(!Cliente.isGroupMsg && Cliente.sender.pushname == "Nathália Mendes"){
                this.clienteService.startClientChat(Whatsapp, Cliente)
            }
        })
    }
}