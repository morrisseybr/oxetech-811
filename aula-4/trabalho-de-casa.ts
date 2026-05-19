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
	tipoIngresso: string;
	quantidade: number;
	usuario: string;
	cupom: string;
};

const DESCONTO_ESTUDANTE = 0.1;
const DESCONTO_FUNCIONARIO = 0.2;
const CUPOM_AULA4 = 500;

export function calcularValorIngresso(ticket: TicketQuote): number {

	const preco = valorDoIngresso(ticket.tipoIngresso);
	const total = preco * ticket.quantidade;
	let valorComDesconto = totalComDesconto(total, ticket.usuario, ticket.cupom)

	if (valorComDesconto < 0) {
		valorComDesconto = 0;
	}

	return Math.round(valorComDesconto);
}

function valorDoIngresso(tipoIngresso: string): number {
	let preco = 0;
	if (tipoIngresso === "normal") {
		preco = 4000;
	}
	if (tipoIngresso === "vip") {
		preco = 9000;
	}
	if (tipoIngresso === "meia") {
		preco = 2000;
	}

	return preco
}

function totalComDesconto(preco: number, usuario: string, cupom: string): number {
	let total = preco
	if (usuario === "estudante") {
		total = total - total * DESCONTO_ESTUDANTE;
	}
	if (usuario === "funcionario") {
		total = total - total * DESCONTO_FUNCIONARIO;
	}
	if (cupom === "AULA4") {
		total = total - CUPOM_AULA4;
	}

	return total;
}

const app = express();
app.use(express.json());

app.post("/tickets/quote", (request, response) => {
	response.json({ totalInCents: calcularValorIngresso(request.body) });
});

export { app };

console.log(
	"Estudante normal x2:",
	calcularValorIngresso({ tipoIngresso: "normal", quantidade: 2, usuario: "estudante", cupom: "" }),
);
console.log(
	"Funcionario vip x1 com cupom:",
	calcularValorIngresso({ tipoIngresso: "vip", quantidade: 1, usuario: "funcionario", cupom: "AULA4" }),
);
console.log(
	"Cliente meia x3:",
	calcularValorIngresso({ tipoIngresso: "meia", quantidade: 3, usuario: "cliente", cupom: "" }),
);
