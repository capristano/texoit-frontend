export class Product {
  id: number;
  nome: string;
  unidade_medida: string;
  quantidade: number;
  preco: number;
  perecivel: boolean;
  data_validade: Date;
  data_fabricacao: Date;
  data_validade_frt: string;
  data_fabricacao_frt: string;

  constructor(id: number
    , nome: string
    , unidade_medida: string
    , quantidade: number
    , preco: number
    , perecivel: boolean
    , data_validade: Date
    , data_fabricacao: Date
    , data_validade_frt: string
    , data_fabricacao_frt: string) {
    this.id = id;
    this.nome = nome;
    this.unidade_medida = unidade_medida;
    this.quantidade = quantidade;
    this.preco = preco;
    this.perecivel = perecivel;
    this.data_validade = data_validade;
    this.data_fabricacao = data_fabricacao;
    this.data_validade_frt = data_validade_frt;
    this.data_fabricacao_frt = data_fabricacao_frt;
  }
}