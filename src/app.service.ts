import { Injectable, OnModuleInit } from '@nestjs/common';
import { WhatsappService } from './modules/Whatsapp/Whatsapp.service';

@Injectable()
export class AppService implements OnModuleInit{
  constructor(
    private readonly whatsappService: WhatsappService
  ){}
  onModuleInit() {
      this.whatsappService.createConnection()
  }
}
