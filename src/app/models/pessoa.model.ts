export interface PessoaRequest {
  nome: string;
  documento: string;
  email: string;
  dataNascimento: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  numero: string;
  complemento?: string;
}

export interface PessoaResponse {
  id: number;
  nome: string;
  documento: string;
  email: string;
  dataNascimento: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  numero: string;
  complemento?: string;
  login: string;
  criadoEm: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: string;
}