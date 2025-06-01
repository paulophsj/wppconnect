import { TipoStatus } from "../enums/TipoStatus.enum";

export interface ClienteStatus {
    tipoStatus: TipoStatus,
    recebeuMensagem: boolean
}