import { Negociacao, Negociacoes } from '../models/index'
import { NegociacoesView, MensagemView } from '../views/index'
import { domInject, throttle } from '../helpers/decorators/index'
import { NegociacaoService } from '../services/index'

export class NegociacaoController {

  @domInject('#data')
  private _inputData: JQuery;

  @domInject('#quantidade')
  private _inputQuantidade: JQuery;

  @domInject('#valor')
  private _inputValor: JQuery;
  private _negociacoes = new Negociacoes();
  private _negociacoesView = new NegociacoesView('#negociacoesView');
  private _mensagemView = new MensagemView('#mensagemView');
  private _service = new NegociacaoService();

  constructor(){
    this._negociacoesView.update(this._negociacoes);
  }

  adiciona(){
    let data = new Date(this._inputData.val().replace(/-/g, ','));
    if(this._eDiaUtil(data)){
      this._mensagemView.update("Somente negociações em dias uteis por favor");
      return
    }

    const negociacao = new Negociacao(
      new Date(data),
      parseInt(this._inputQuantidade.val()),
      parseFloat(this._inputValor.val())
    );
    this._negociacoes.adiciona(negociacao);
    this._negociacoesView.update(this._negociacoes);
    this._mensagemView.update('Negociação adicionada com sucesso!');
  }

  @throttle(500)
  importarDados() {
    this._service
    .obterNegociacoes((res: Response) => {
      if(res.ok) {
        return res;
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(negociacoes => {
      if(negociacoes){
        negociacoes.forEach(negociacao => 
          this._negociacoes.adiciona(negociacao));
      this._negociacoesView.update(this._negociacoes);
      } 
    });       
  }

  private _eDiaUtil(data: Date): boolean{
    return (data.getDay() === DiaDaSemana.Domingo || data.getDay() === DiaDaSemana.Sabado) ? true : false;
  }
}

enum DiaDaSemana{
  Domingo,
  Segunda,
  Terça,
  Quarta,
  Quinta,
  Sexta,
  Sabado
}