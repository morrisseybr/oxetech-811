// =============================================================================
// TRABALHO DE CASA — Refatoração (gabarito sugerido)
// =============================================================================
// Aplicado:
//   - Renomes: Emp→EmprestimoAtrasado, calc→calcularMulta, t→tipoDeUsuario,
//     cat→categoria, v/m→nomes locais expressivos.
//   - Números mágicos viraram constantes (multa diária por tipo, limites etc.).
//   - Comentários redundantes apagados; intencionais só onde explicam o porquê.
//   - Uma função pequena extraída como exemplo opcional (penalidadePorAtrasoLongo).
//   - Saída no console idêntica à versão original.
// =============================================================================

type CategoriaDeLivro = "tecnico" | "ficcao" | "infantil";
type TipoDeUsuario = "aluno" | "professor" | "visitante";

type EmprestimoAtrasado = {
	diasDeAtraso: number;
	categoria: CategoriaDeLivro;
	tipoDeUsuario: TipoDeUsuario;
	precoDoLivroCentavos: number;
};

const MULTA_DIARIA_POR_TIPO_CENTAVOS: Record<TipoDeUsuario, number> = {
	aluno: 100,
	professor: 50,
	visitante: 200,
};

const DIAS_PARA_PENALIDADE_EXTRA = 30;
const PERCENTUAL_DA_PENALIDADE_EXTRA = 0.5;
const MULTIPLICADOR_LIVRO_TECNICO = 2;

export function calcularMulta(emprestimo: EmprestimoAtrasado): number {
	if (emprestimo.diasDeAtraso <= 0) return 0;

	const multaBase =
		MULTA_DIARIA_POR_TIPO_CENTAVOS[emprestimo.tipoDeUsuario] *
		emprestimo.diasDeAtraso;
	const multa = multaBase + penalidadePorAtrasoLongo(emprestimo);

	if (emprestimo.categoria === "tecnico") {
		return multa * MULTIPLICADOR_LIVRO_TECNICO;
	}
	return multa;
}

function penalidadePorAtrasoLongo(emprestimo: EmprestimoAtrasado): number {
	if (emprestimo.diasDeAtraso <= DIAS_PARA_PENALIDADE_EXTRA) return 0;
	return Math.floor(
		emprestimo.precoDoLivroCentavos * PERCENTUAL_DA_PENALIDADE_EXTRA,
	);
}

console.log(
	"Aluno, 5 dias, ficcao:",
	calcularMulta({
		diasDeAtraso: 5,
		categoria: "ficcao",
		tipoDeUsuario: "aluno",
		precoDoLivroCentavos: 4990,
	}),
);
console.log(
	"Professor, 35 dias, tecnico:",
	calcularMulta({
		diasDeAtraso: 35,
		categoria: "tecnico",
		tipoDeUsuario: "professor",
		precoDoLivroCentavos: 9990,
	}),
);
console.log(
	"Visitante, 0 dias:",
	calcularMulta({
		diasDeAtraso: 0,
		categoria: "infantil",
		tipoDeUsuario: "visitante",
		precoDoLivroCentavos: 3990,
	}),
);
