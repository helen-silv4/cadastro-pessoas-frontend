import { TestBed } from '@angular/core/testing';
import { PessoaService } from './pessoa';

describe('PessoaService', () => {
  let service: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PessoaService]
    });
    service = TestBed.inject(PessoaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});