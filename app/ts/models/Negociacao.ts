export class Negociacao {

  constructor(readonly data: Date, readonly quantidade: number, readonly valor: number){
  }

  get volume() : Number {

    return this.quantidade * this.valor;
  }

  paraTexto(): void {
    console.log(
      `Data: ${this.data}
       Quantidade: ${this.quantidade}
       Valor: ${this.valor}
       Volume: ${this.volume}
      `
    );
  }
}
