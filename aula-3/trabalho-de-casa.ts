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

type bookLoan = {
	daysLate: number;
	bookGenre: string; // "tecnico", "ficcao", "infantil"
	whoPickedUpTheBook: number; // 1 = aluno, 2 = professor, 3 = visitante
	bookprice: number; // em centavos
};

export function calculateBookLateFee(bookloan: bookLoan): number {
	const TECHNICAL_GENRE_MULTIPLIER = 2;
	const LONG_LATE_THRESHOLD = 30;
	const LONG_LATE_FEE_MULTIPLIER = 0.5;

	if (bookloan.daysLate <= 0) {
		return 0;
	}
	else {
		let baseFee = feePerDay(bookloan.whoPickedUpTheBook) * bookloan.daysLate;
		// adicional se atraso longo
		if (bookloan.daysLate > LONG_LATE_THRESHOLD) {
			baseFee = baseFee + Math.floor(bookloan.bookprice * LONG_LATE_FEE_MULTIPLIER);
		}
		// tecnico em dobro
		if (bookloan.bookGenre === "tecnico") {
			baseFee = baseFee * TECHNICAL_GENRE_MULTIPLIER;
		}
		return baseFee;

	}
}

function feePerDay(whoPickedUpTheBook: number): number {
	const FINE_ALUNO = 100;
	const FINE_PROFESSOR = 50;
	const FINE_VISITANTE = 200;

	switch (whoPickedUpTheBook) {
		case 1:
			return FINE_ALUNO;
		case 2:
			return FINE_PROFESSOR;
		case 3:
			return FINE_VISITANTE;
		default:
			throw new Error("Tipo de usuário inválido");
	}
}

console.log(
	"Aluno, 5 dias, ficcao:",
	calculateBookLateFee({ daysLate: 5, bookGenre: "ficcao", whoPickedUpTheBook: 1, bookprice: 4990 }),
);
console.log(
	"Professor, 35 dias, tecnico:",
	calculateBookLateFee({ daysLate: 35, bookGenre: "tecnico", whoPickedUpTheBook: 2, bookprice: 9990 }),
);
console.log(
	"Visitante, 0 dias:",
	calculateBookLateFee({ daysLate: 0, bookGenre: "infantil", whoPickedUpTheBook: 3, bookprice: 3990 }),
);
