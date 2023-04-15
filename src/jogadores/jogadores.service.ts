import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);
  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    // const jogadorEncontrado = await this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (jogadorEncontrado) {
      await this.atualizar(criarJogadorDto);
    } else {
      await this.criar(criarJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    // return await this.jogadores;
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} nao encontrado!`,
      );
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email): Promise<any> {
    // const jogadorEncontrado = await this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );
    // this.jogadores = this.jogadores.filter(
    //   (jogador) => jogador.email !== jogadorEncontrado.email,
    // );
    return await this.jogadorModel.deleteOne({ email }).exec();
  }

  private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    // const { nome, email, telefoneCelular } = criaJogadorDto;
    // const jogador: Jogador = {
    //   _id: uuidv4(),
    //   nome,
    //   telefoneCelular,
    //   email,
    //   ranking: 'A',
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    // };
    // this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    // this.jogadores.push(jogador);
    const jogadorCriado = new this.jogadorModel(criaJogadorDto);
    return await jogadorCriado.save();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel.findOneAndUpdate(
      { email: criarJogadorDto.email },
      { $set: criarJogadorDto },
    );
    // const { nome } = criarJogadorDto;
    // jogadorEncontrado.nome = nome;
  }
}
