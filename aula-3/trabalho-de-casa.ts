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

type Emprestimo = {
	diasDeAtraso: number;
	categoria: string; // "tecnico", "ficcao", "infantil"
	tipoUsuario: number; // 1 = aluno, 2 = professor, 3 = visitante
	precoLivro: number; // em centavos
};

// calcula a multa de um emprestimo atrasado
// recebe o emprestimo e retorna o valor da multa em centavos
// regras:
//   - 1 real por dia de atraso para aluno
//   - 50 centavos por dia para professor
//   - 2 reais por dia para visitante
//   - se atraso > 30 dias, soma 50% do preco do livro
//   - livro tecnico paga em dobro
export function calcularMulta(emprestimo: Emprestimo): number {
	if (emprestimo.diasDeAtraso <= 0) {
		return 0;
	}
	let valorMulta = 0;
	if (emprestimo.tipoUsuario === 1) {
		valorMulta = 100;
	}
	if (emprestimo.tipoUsuario === 2) {
		valorMulta = 50;
	}
	if (emprestimo.tipoUsuario === 3) {
		valorMulta = 200;
	}
	let m = valorMulta * emprestimo.diasDeAtraso;
	if (emprestimo.diasDeAtraso > 30) {
		m = m + Math.floor(emprestimo.precoLivro * 0.5);
	}
	if (emprestimo.categoria === "tecnico") {
		m = m * 2;
	}
	return m;
}

console.log(
	"Aluno, 5 dias, ficcao:",
	calcularMulta({ diasDeAtraso: 5, categoria: "ficcao", tipoUsuario: 1, precoLivro: 4990 }),
);
console.log(
	"Professor, 35 dias, tecnico:",
	calcularMulta({ diasDeAtraso: 35, categoria: "tecnico", tipoUsuario: 2, precoLivro: 9990 }),
);
console.log(
	"Visitante, 0 dias:",
	calcularMulta({ diasDeAtraso: 0, categoria: "infantil", tipoUsuario: 3, precoLivro: 3990 }),
);
