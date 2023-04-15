import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (jogadorEncontrado) {
      await this.atualizar(jogadorEncontrado, criarJogadorDto);
    } else {
      await this.criar(criarJogadorDto);
    }
  }
  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }
  async consultarJogadoresPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} nao encontrado!`,
      );
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email): Promise<void> {
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );
    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== jogadorEncontrado.email,
    );
  }
  private criar(criaJogadorDto: CriarJogadorDto): void {
    const { nome, email, telefoneCelular } = criaJogadorDto;
    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    };
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }
  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): void {
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
  }
}
