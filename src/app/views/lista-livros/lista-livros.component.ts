import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, throwError } from 'rxjs';
import { LivroService } from './../../service/livro.service';
import { Component } from '@angular/core';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  msgError = '';
  livrosResultado: LivrosResultado;

  constructor(private livroService: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(300),
      filter((valorDigitado) => valorDigitado.length >= 3),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.livroService.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      map(resultado => resultado.items ?? []),
      map((items) => this.buildLivros(items)),
      catchError(err => {
        // this.msgError = 'Ocorreu um erro!';
        // return EMPTY;
        return throwError(() => new Error(this.msgError = 'Ocorreu um erro!'))
      })
    )

  buildLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }
}
