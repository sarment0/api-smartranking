import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/smartranking', {
      //por algum motivo em localhost não funciona essa parte
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useUnifiedTopology: true,
      // useFindAndModify: true,
    }),
    JogadoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
