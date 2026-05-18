// =============================================================================
// BLOCO 1 — Nomes e funções que se explicam sozinhos
// =============================================================================
// Prática (~10 min):
//   1) Renomeie identificadores ruins para revelar intenção.
//   2) Substitua os números mágicos (1, 2, 0.05, 0.1) por constantes nomeadas.
//   3) Quebre `calc` em funções pequenas, cada uma com uma responsabilidade.
//   4) Remova o flag argument `log` (separe cálculo de efeito colateral).
// =============================================================================

type RegistroDeItem = { nomeDoItem: string; valorDoItem: number; quantidadeDoItem: number };

type TipoCliente = "aluno" | "professor";

const descontoPorTipoCliente = {
	"aluno": 0.05,
	"professor": 0.1,    
} as const;

function calcularSubtotal(itens: RegistroDeItem[]): number {
	return itens.reduce((valorAcumulado, item) => valorAcumulado + item.valorDoItem * item.quantidadeDoItem, 0);
}

function calcularDesconto(precoTotal: number, tipoCliente: TipoCliente): number {
	return descontoPorTipoCliente[tipoCliente] * precoTotal;
}

function registrarLogDeVendas(precoTotal: number, desconto: number, precoFinal: number): void {
	console.log("Subtotal: R$ " + (precoTotal / 100).toFixed(2));
	console.log("Desconto: R$ " + (desconto / 100).toFixed(2));
	console.log("Total:    R$ " + (precoFinal / 100).toFixed(2));
}
// Calcula o total de um carrinho aplicando desconto por tipo de cliente
// e, opcionalmente, imprime o recibo. Mistura cálculo com efeito colateral.
export function calcularPrecoPorTipoCliente(itens: RegistroDeItem[], tipoCliente: TipoCliente): number {
	const precoTotal = calcularSubtotal(itens);
	const desconto = calcularDesconto(precoTotal, tipoCliente);
	const precoFinal = precoTotal - desconto;

	registrarLogDeVendas(precoTotal, desconto, precoFinal);

	return precoFinal;
}

const carrinho: RegistroDeItem[] = [
	{ nomeDoItem: "Camiseta", valorDoItem: 7990, quantidadeDoItem: 2 },
	{ nomeDoItem: "Tênis", valorDoItem: 24990, quantidadeDoItem: 1 },
];

calcularPrecoPorTipoCliente(carrinho, "aluno");
