// =============================================================================
// TRABALHO DE CASA — Refatore esta funçãozinha!
// =============================================================================
// Você vai abrir um PR semântico (refactor: ...) no repositório do curso.
// Não se assuste: o objetivo é PRATICAR o que vimos na aula, não reescrever
// o mundo. É uma função pequena — você consegue!
//
// Sugestão de passos (fique à vontade para misturar):
//   1) Instale ESLint + Prettier (ou Biome) e deixe o formatador rodar.
//   2) Renomeie `Emp`, `calc`, `e`, `t`, `cat`, `v`, `m` para algo que se
//      explique sozinho.
//   3) Substitua os números mágicos (100, 50, 200, 30, 0.5, 2) por
//      constantes nomeadas.
//   4) Apague comentários que apenas repetem o código.
//   5) (Opcional) Extraia 1 função pequena, se sentir vontade.
//
// Critérios de aceite (simples):
//   - `npm run casa` imprime a MESMA saída antes e depois.
//   - O diff está legível.
//   - A descrição do PR conta POR QUÊ você mexeu em cada coisa.
// =============================================================================

type LivroEmprestado = {
	diasDeAtraso: number;
	categoria: string;
	tipoUsuario: number; // 1 = aluno, 2 = professor, 3 = visitante
	precoLivro: number; // em centavos
};

export function calculaMulta(registroEmprestimo: LivroEmprestado): number {
	if (registroEmprestimo.diasDeAtraso <= 0) {
		return 0;
	}

	let valorAtrasoPorDia = 0;
	const taxaAdicional = 0.5;
	const LIMITE_DIAS_ATRASO = 30;

	valorAtrasoPorDia = multaBasePorDia(registroEmprestimo.tipoUsuario);
	let multa = valorAtrasoPorDia * registroEmprestimo.diasDeAtraso;

	if (registroEmprestimo.diasDeAtraso > LIMITE_DIAS_ATRASO) {
		multa = multa + Math.floor(registroEmprestimo.precoLivro * taxaAdicional);
	}
	if (registroEmprestimo.categoria === "tecnico") {
		multa = multa * 2;
	}
	return multa;
}

function multaBasePorDia(tipoUsuario: number): number {
	const multaPorDiaAluno = 100;
	const multaPorDiaProfessor = 50;
	const multaPorDiaVisitante = 200;
	if (tipoUsuario === 1) {
		return multaPorDiaAluno;
	}
	if (tipoUsuario === 2) {
		return multaPorDiaProfessor;
	}
	if (tipoUsuario === 3) {
		return multaPorDiaVisitante;
	}
	return 0;
}

// exemplos — a saída no console não pode mudar depois da refatoração
console.log(
	"Aluno, 5 dias, ficcao:",
	calculaMulta({
		diasDeAtraso: 5,
		categoria: "ficcao",
		tipoUsuario: 1,
		precoLivro: 4990,
	}),
);
console.log(
	"Professor, 35 dias, tecnico:",
	calculaMulta({
		diasDeAtraso: 35,
		categoria: "tecnico",
		tipoUsuario: 2,
		precoLivro: 9990,
	}),
);
console.log(
	"Visitante, 0 dias:",
	calculaMulta({
		diasDeAtraso: 0,
		categoria: "infantil",
		tipoUsuario: 3,
		precoLivro: 3990,
	}),
);
