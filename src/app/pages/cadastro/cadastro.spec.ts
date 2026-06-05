import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  let component: Cadastro;
  let fixture: ComponentFixture<Cadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar o formulário inválido', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('deve validar nome obrigatório', () => {
    const nome = component.form.get('nome');
    nome?.setValue('');
    expect(nome?.hasError('required')).toBeTruthy();
  });

  it('deve rejeitar nome com apenas uma palavra', () => {
    const nome = component.form.get('nome');
    nome?.setValue('Maria');
    expect(nome?.hasError('pattern')).toBeTruthy();
  });

  it('deve rejeitar nome com caracteres especiais', () => {
    const nome = component.form.get('nome');
    nome?.setValue('Maria@Silva');
    expect(nome?.hasError('pattern')).toBeTruthy();
  });

  it('deve aceitar nome válido com duas palavras', () => {
    const nome = component.form.get('nome');
    nome?.setValue('Maria Silva');
    expect(nome?.valid).toBeTruthy();
  });

  it('deve validar CPF obrigatório', () => {
    const doc = component.form.get('documento');
    doc?.setValue('');
    expect(doc?.hasError('required')).toBeTruthy();
  });

  it('deve rejeitar CPF com formato inválido', () => {
    const doc = component.form.get('documento');
    doc?.setValue('123.456.789-00');
    expect(doc?.hasError('cpfInvalido')).toBeTruthy();
  });

  it('deve aceitar CPF válido', () => {
    const doc = component.form.get('documento');
    doc?.setValue('529.982.247-25');
    expect(doc?.valid).toBeTruthy();
  });

  it('deve validar email obrigatório', () => {
    const email = component.form.get('email');
    email?.setValue('');
    expect(email?.hasError('required')).toBeTruthy();
  });

  it('deve rejeitar email inválido', () => {
    const email = component.form.get('email');
    email?.setValue('emailinvalido');
    expect(email?.hasError('email')).toBeTruthy();
  });

  it('deve aceitar email válido', () => {
    const email = component.form.get('email');
    email?.setValue('teste@exemplo.com');
    expect(email?.valid).toBeTruthy();
  });

  it('deve rejeitar data de nascimento futura', () => {
    const data = component.form.get('dataNascimento');
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    data?.setValue(amanha.toISOString().split('T')[0]);
    expect(data?.hasError('dataFutura')).toBeTruthy();
  });

  it('deve rejeitar data de nascimento anterior a 120 anos', () => {
    const data = component.form.get('dataNascimento');
    data?.setValue('1900-01-01');
    expect(data?.hasError('dataAntiga')).toBeTruthy();
  });

  it('deve aceitar data de nascimento válida', () => {
    const data = component.form.get('dataNascimento');
    data?.setValue('1990-06-15');
    expect(data?.valid).toBeTruthy();
  });

  it('deve validar CEP obrigatório', () => {
    const cep = component.form.get('cep');
    cep?.setValue('');
    expect(cep?.hasError('required')).toBeTruthy();
  });

  it('deve rejeitar CEP com formato inválido', () => {
    const cep = component.form.get('cep');
    cep?.setValue('1234567');
    expect(cep?.hasError('pattern')).toBeTruthy();
  });

  it('deve aceitar CEP com formato válido', () => {
    const cep = component.form.get('cep');
    cep?.setValue('01310-100');
    expect(cep?.valid).toBeTruthy();
  });

  it('deve marcar todos os campos como touched ao enviar formulário inválido', () => {
    component.enviar();
    expect(component.form.touched).toBeTruthy();
  });

  it('deve resetar o formulário ao chamar novoCadastro', () => {
    component.pessoaCadastrada = {} as any;
    component.erroGeral = 'erro';
    component.novoCadastro();
    expect(component.pessoaCadastrada).toBeNull();
    expect(component.erroGeral).toBeNull();
    expect(component.form.pristine).toBeTruthy();
  });
});