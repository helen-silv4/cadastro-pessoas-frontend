import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PessoaRequest, PessoaResponse, ViaCepResponse } from '../models/pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private readonly apiUrl = 'http://localhost:8080/pessoas';
  private readonly viaCepUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  cadastrar(request: PessoaRequest): Observable<PessoaResponse> {
    return this.http.post<PessoaResponse>(this.apiUrl, request);
  }

  buscarCep(cep: string): Observable<ViaCepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<ViaCepResponse>(`${this.viaCepUrl}/${cepLimpo}/json/`);
  }
}