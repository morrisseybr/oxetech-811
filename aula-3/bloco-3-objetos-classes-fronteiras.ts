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
