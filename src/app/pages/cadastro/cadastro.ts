import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../services/pessoa';
import { PessoaResponse } from '../../models/pessoa.model';

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss'
})
export class Cadastro {

  form: FormGroup;
  carregando = false;
  pessoaCadastrada: PessoaResponse | null = null;
  erroGeral: string | null = null;
  hoje = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private pessoaService: PessoaService) {
    this.form = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$')
      ]],
      documento: ['', [
        Validators.required,
        Validators.pattern('^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', Validators.required],
      cep: ['', [
        Validators.required,
        Validators.pattern('^\\d{5}-\\d{3}$')
      ]],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['']
    });
  }

  buscarCep(): void {
    const cep = this.form.get('cep')?.value;
    if (!cep || cep.length < 9) return;

    this.pessoaService.buscarCep(cep).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.form.get('cep')?.setErrors({ cepInvalido: true });
          return;
        }
        this.form.patchValue({
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          uf: dados.uf
        });
      },
      error: () => {
        this.form.get('cep')?.setErrors({ cepInvalido: true });
      }
    });
  }

  aplicarMascaraCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    valor = valor
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.form.get('documento')?.setValue(valor, { emitEvent: false });
  }

  aplicarMascaraCep(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    this.form.get('cep')?.setValue(valor, { emitEvent: false });
    if (valor.length === 9) this.buscarCep();
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erroGeral = null;

    this.pessoaService.cadastrar(this.form.value).subscribe({
      next: (response) => {
        this.pessoaCadastrada = response;
        this.carregando = false;
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 422) {
          this.erroGeral = err.error?.erro || 'Erro ao cadastrar pessoa.';
        } else {
          this.erroGeral = 'Erro inesperado. Tente novamente.';
        }
      }
    });
  }

  novoCadastro(): void {
    this.pessoaCadastrada = null;
    this.erroGeral = null;
    this.form.reset();
  }
}