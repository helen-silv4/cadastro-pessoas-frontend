import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../services/pessoa';
import { PessoaResponse } from '../../models/pessoa.model';

function validarDataNascimento(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const data = new Date(valor);
  const hoje = new Date();
  const minima = new Date();
  minima.setFullYear(hoje.getFullYear() - 120);

  if (data > hoje) return { dataFutura: true };
  if (data < minima) return { dataAntiga: true };

  return null;
}

function validarCpf(control: AbstractControl): ValidationErrors | null {
  const cpf = control.value?.replace(/\D/g, '');
  if (!cpf || cpf.length !== 11) return null;
  if (cpf.split('').every((d: string) => d === cpf[0])) return { cpfInvalido: true };

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let first = 11 - (sum % 11);
  if (first >= 10) first = 0;
  if (first !== parseInt(cpf[9])) return { cpfInvalido: true };

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let second = 11 - (sum % 11);
  if (second >= 10) second = 0;
  if (second !== parseInt(cpf[10])) return { cpfInvalido: true };

  return null;
}

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

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)+$')
      ]],
      documento: ['', [
        Validators.required,
        Validators.pattern('^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$'),
        validarCpf
      ]],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required, validarDataNascimento]],
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

  onNomeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.replace(/[^a-zA-Z ]/g, '');
    this.form.get('nome')?.setValue(valor, { emitEvent: false });
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 422) {
          this.erroGeral = err.error?.erro || 'Erro ao cadastrar pessoa.';
        } else {
          this.erroGeral = 'Erro inesperado. Tente novamente.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  novoCadastro(): void {
    this.pessoaCadastrada = null;
    this.erroGeral = null;
    this.form.reset();
    this.cdr.detectChanges();
  }
}