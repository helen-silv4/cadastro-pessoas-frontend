import { Component } from '@angular/core';
import { Cadastro } from './pages/cadastro/cadastro';

@Component({
  selector: 'app-root',
  imports: [Cadastro],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}