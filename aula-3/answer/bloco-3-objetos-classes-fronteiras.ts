// =============================================================================
// BLOCO 3 — Objetos, classes e fronteiras (REFATORADO)
// =============================================================================
// Aplicado:
//   - Lei de Deméter: `Cliente` expõe `cidadeDeEntrega()` em vez de
//     `cliente.endereco.cidade.estado.sigla`.
//   - Pedido virou DTO (apenas dados); sem método pendurado.
//   - Fronteira com o vendor isolada em um Adapter (`GatewayVendor`) por
//     trás da interface `GatewayDePagamento`.
// =============================================================================

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

// Domínio — Deméter respeitada: peça o que quer, não o "neto".
export class Endereco {
	constructor(
		private readonly rua: string,
		private readonly cidade: string,
		private readonly uf: string,
	) {}

	public cidadeFormatada(): string {
		return this.cidade + "/" + this.uf;
	}
}

export class Cliente {
	constructor(
		public readonly nome: string,
		private readonly endereco: Endereco,
	) {}

	public cidadeDeEntrega(): string {
		return this.endereco.cidadeFormatada();
	}
}

// Pedido como DTO — apenas dados, sem comportamento.
export type Pedido = {
	readonly clienteNome: string;
	readonly totalCentavos: number;
	readonly txid: string;
};

// Fronteira com o terceiro: Adapter + erro próprio do domínio.
export class FalhaDePagamento extends Error {
	constructor(public readonly codigo: number) {
		super("Falha no pagamento (código " + codigo + ")");
	}
}

export interface GatewayDePagamento {
	cobrar(valorCentavos: number, token: string): string;
}

export class GatewayVendor implements GatewayDePagamento {
	public cobrar(valorCentavos: number, token: string): string {
		const r = PagamentoVendorSDK.charge({
			amount_cents: valorCentavos,
			token,
		});
		if (r.status === "fail" || r.txid === undefined) {
			throw new FalhaDePagamento(r.code);
		}
		return r.txid;
	}
}

export class ServicoDePedidos {
	constructor(private readonly gateway: GatewayDePagamento) {}

	public processar(
		cliente: Cliente,
		totalCentavos: number,
		token: string,
	): Pedido {
		console.log("Entrega para " + cliente.cidadeDeEntrega());
		const txid = this.gateway.cobrar(totalCentavos, token);
		console.log("E-mail enviado para " + cliente.nome);
		return { clienteNome: cliente.nome, totalCentavos, txid };
	}
}

const cliente = new Cliente("Ana", new Endereco("Rua X", "Aracaju", "SE"));
console.log(
	new ServicoDePedidos(new GatewayVendor()).processar(cliente, 10000, "tok123"),
);
