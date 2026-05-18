// =============================================================================
// BLOCO 3 — Objetos, classes e fronteiras com o mundo externo
// =============================================================================
// Prática (~10 min):
//   1) Aponte a violação da Lei de Deméter em `processar` (cliente.endereco.cidade...).
/* R: A violação da lei de Deméter acontece dentro do console.log, em que se acessa a estrutura interna  de cliente, 
		   descendo 3 camdadas, o ideal seria salvar o endereço em uma variável local, e utilizar uma função para imprimir o endereço.
		*/

//   2) Onde está a fronteira com o vendor? Como envolver em um Adapter?
/* 		R: A fronteira com o vendor está na linha 59, onde é feito o charge do pagamento,
		para usar um adapter, o ideal seria uma função para fazer o charge do pagamento,
		esta função seria um adapter para o SDK do vendor, e poderia ser extensa futuramente
		para incluir outros meios ou libs para fazer o charge do pagamento.
*/
//   3) `Pedido` mistura DTO (dados públicos) com objeto (método). Como separar?
/* R: Pedido hoje mistura dados expostos (clienteNome, totalCentavos, txid) com
		comportamento (estaPago()). Para separar: (1) criar um PedidoDTO (type) só
		com os campos, para transportar entre camadas/API/banco; (2) manter a lógica
		em Pedido (classe) com estaPago() e campos privados, ou em uma função
		pedidoEstaPago(dto); (3) na fronteira, converter com toDTO() ao retornar
		dados e fromDTO() ao receber — o DTO serializa; o objeto de domínio
		encapsula a regra de negócio.
*/
//
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

export class Cliente {
  public nome = "";
  public endereco = {
    rua: "",
    cidade: { nome: "", estado: { sigla: "" } },
  };
}

export class Pedido {
  public clienteNome = "";
  public totalCentavos = 0;
  public txid = "";
  public estaPago(): boolean {
    return this.txid !== "";
  }
}

export class GerenciadorDePedidos {
  public processar(
    cliente: Cliente,
    totalCentavos: number,
    token: string,
  ): Pedido {
    // Deméter: cadeia de getters expondo a estrutura interna do cliente.
    console.log(
      "Entrega para " +
        cliente.endereco.cidade.nome +
        "/" +
        cliente.endereco.cidade.estado.sigla,
    );

    // Dependência direta do vendor — sem fronteira, sem adapter.
    const r = PagamentoVendorSDK.charge({
      amount_cents: totalCentavos,
      token,
    });
    if (r.status === "fail") {
      throw new Error("Falha vendor código " + r.code);
    }

    const p = new Pedido();
    p.clienteNome = cliente.nome;
    p.totalCentavos = totalCentavos;
    p.txid = r.txid!;
    console.log("E-mail enviado para " + cliente.nome);
    return p;
  }
}

const c = new Cliente();
c.nome = "Ana";
c.endereco = { rua: "X", cidade: { nome: "Aracaju", estado: { sigla: "SE" } } };
console.log(new GerenciadorDePedidos().processar(c, 10000, "tok123"));
