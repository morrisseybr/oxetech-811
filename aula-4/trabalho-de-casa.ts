import express from "express";

// =============================================================================
// TRABALHO DE CASA — Mapa de smells + refatoração pequena
// =============================================================================
// Entrega:
//   Abra um PR semântico no repositório do curso até a véspera da Aula 5.
//
// O que fazer:
//   1) Mapeie de 3 a 5 smells em uma tabela no corpo do PR:
//      smell -> evidencia -> impacto -> refatoracao sugerida
//   2) Aplique UMA refatoração pequena e segura neste arquivo.
//   3) Valide que `npm run casa` continua imprimindo a mesma saída.
//
// Sugestões de refatoração:
//   - Rename: melhorar nomes como `t`, `qtd`, `usr`, `calc`.
//   - Extract Variable: nomear valores intermediários.
//   - Extract Function: separar desconto ou cálculo de preço base.
//   - Remover duplicação simples.
//
// Dica:
//   Não tente refatorar tudo. Uma mudança pequena, bem explicada e validada,
//   vale mais do que uma mudança grande difícil de revisar.
// =============================================================================

type TicketQuote = {
	t: string; // "normal", "vip", "meia"
	qtd: number;
	usr: string; // "estudante", "cliente", "funcionario"
	cupom: string;
};

export function calc(ticket: TicketQuote): number {
	let price = 0;

	if (ticket.t === "normal") {
		price = 4000;
	}
	if (ticket.t === "vip") {
		price = 9000;
	}
	if (ticket.t === "meia") {
		price = 2000;
	}

	let total = price * ticket.qtd;

	if (ticket.usr === "estudante") {
		total = total - total * 0.1;
	}
	if (ticket.usr === "funcionario") {
		total = total - total * 0.2;
	}
	if (ticket.cupom === "AULA4") {
		total = total - 500;
	}

	if (total < 0) {
		total = 0;
	}

	return Math.round(total);
}

const app = express();
app.use(express.json());

app.post("/tickets/quote", (request, response) => {
	response.json({ totalInCents: calc(request.body) });
});

export { app };

console.log(
	"Estudante normal x2:",
	calc({ t: "normal", qtd: 2, usr: "estudante", cupom: "" }),
);
console.log(
	"Funcionario vip x1 com cupom:",
	calc({ t: "vip", qtd: 1, usr: "funcionario", cupom: "AULA4" }),
);
console.log(
	"Cliente meia x3:",
	calc({ t: "meia", qtd: 3, usr: "cliente", cupom: "" }),
);
