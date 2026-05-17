// =============================================================================
// BLOCO 3 — Objetos, classes e fronteiras com o mundo externo
// =============================================================================
// Prática (~10 min):
//   1) Aponte a violação da Lei de Deméter em `processar` (cliente.endereco.cidade...).
//   2) Onde está a fronteira com o vendor? Como envolver em um Adapter?
//   3) `Pedido` mistura DTO (dados públicos) com objeto (método). Como separar?
// =============================================================================

// SDK externo simulado (imagine `npm install pagamento-vendor`)
export const PagamentoVendorSDK = {
  charge(p: { amount_cents: number; token: string }): {
    status: "ok" | "fail";
    code: number;
    txid?: string;
  } {
    if (p.token === "") return { status: "fail", code: 401 };
    return { status: "ok", code: 200, txid: "tx_" + Date.now() };
  },
};

export class Endereco {
  constructor(
    private readonly rua: string,
    private readonly cidade: string,
    private readonly estado: string,
  ) {}

  public cidadeFormatada(): string {
    return this.cidade + "/" + this.estado 
  }
}

export class Cliente {
  constructor(
    public readonly nome: string,
    private readonly endereco: Endereco
  ) {}

  public cidadeEntrega(): string {
    return this.endereco.cidadeFormatada()
  }
}

export type Pedido ={
  readonly clienteNome: string,
  readonly totalCentavos: number,
  readonly txid: string,
};

export class FalhaPagamento extends Error {
  constructor(public readonly codigo: number){
    super("Falha no pagamento ( codigo " + codigo + ")")
  }
}

export interface GetewayPagamento {
  cobrar(valorCentavos: number, token: string): string;
}

export class GetewayVendedor {
  public cobrar(valorCentavos: number, token: string): string {
    const resposta = PagamentoVendorSDK.charge({
    amount_cents: valorCentavos,
    token
  });
  if(resposta.status === 'fail' || resposta.txid === undefined){
    throw new FalhaPagamento(resposta.code);
  }
  return resposta.txid;
  };
  
}

export class ServicoPedidos {
  constructor(private readonly geteway: GetewayPagamento){}

  public Processar(
    cliente: Cliente,
    totalCentavos: number,
    token: string
  ): Pedido {
    console.log("Entrega para " + cliente.cidadeEntrega());
    const txid = this.geteway.cobrar(totalCentavos, token);
    console.log("E-mail enviado para " + cliente.nome);
    return {clienteNome: cliente.nome, totalCentavos, txid};
  }
}
