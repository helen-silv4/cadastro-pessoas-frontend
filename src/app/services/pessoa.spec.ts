import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PessoaService } from './pessoa';
import { PessoaRequest } from '../models/pessoa.model';

describe('PessoaService', () => {
  let service: PessoaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PessoaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PessoaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve fazer POST para cadastrar pessoa', () => {
    const request: PessoaRequest = {
      nome: 'Maria Silva Santos',
      documento: '529.982.247-25',
      email: 'maria@exemplo.com',
      dataNascimento: '1998-03-14',
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      numero: '100'
    };

    const responseMock = { id: 1, login: 'marisis', ...request, criadoEm: '2026-01-01T00:00:00' };

    service.cadastrar(request).subscribe(response => {
      expect(response.login).toBe('marisis');
      expect(response.id).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:8080/pessoas');
    expect(req.request.method).toBe('POST');
    req.flush(responseMock);
  });

  it('deve fazer GET para buscar CEP', () => {
    const cepMock = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP'
    };

    service.buscarCep('01310-100').subscribe(response => {
      expect(response.logradouro).toBe('Avenida Paulista');
      expect(response.localidade).toBe('São Paulo');
    });

    const req = httpMock.expectOne('https://viacep.com.br/ws/01310100/json/');
    expect(req.request.method).toBe('GET');
    req.flush(cepMock);
  });

  it('deve retornar erro quando CEP não encontrado', () => {
    service.buscarCep('00000-000').subscribe(response => {
      expect(response.erro).toBe('true');
    });

    const req = httpMock.expectOne('https://viacep.com.br/ws/00000000/json/');
    req.flush({ erro: 'true' });
  });
});