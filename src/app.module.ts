import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WhatsappModule } from './modules/Whatsapp/Whatsapp.module';

@Module({
  imports: [WhatsappModule],
  providers: [AppService],
})
export class AppModule {}
