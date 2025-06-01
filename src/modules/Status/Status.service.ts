import { Injectable } from "@nestjs/common"
import { TipoStatus } from "src/common/enums/TipoStatus.enum"
import { ClienteStatus } from "src/common/interfaces/ClienteStatus.interface"

@Injectable()
export class StatusService {
    private clienteStatus: Map<string, ClienteStatus> = new Map()
    constructor(){}
    getClienteStatus(Cliente: string): ClienteStatus{
        if(!this.clienteStatus.has(Cliente)){
            this.setClienteStatus(Cliente, {
                tipoStatus: TipoStatus.INICIO,
                recebeuMensagem: false
            })
        }
        return this.clienteStatus.get(Cliente)!
    }
    setClienteStatus(Cliente: string, Status: ClienteStatus): void{
        this.clienteStatus.set(Cliente, Status)
    }
    removeClienteStatus(Cliente: string): void{
        this.clienteStatus.delete(Cliente)
    }
}