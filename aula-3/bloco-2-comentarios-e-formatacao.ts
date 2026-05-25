// =============================================================================
// BLOCO 2 — Comentários sob suspeita e formatação automatizada
// =============================================================================
// Prática (~10 min):
//   1) Rode o formatador (Prettier/Biome) e veja a indentação se ajeitar.
//   2) Apague comentários redundantes ou troque-os por nomes melhores.
//   3) Mantenha apenas comentários legítimos (aviso, "por quê", TODO).
// =============================================================================

export class User {
	private id: string;
	private userName: string;
	private age: number;

	constructor(id: string, userName: string, age: number) {
		this.id = id;
		this.userName = userName;
		this.age = age;
	}

	// OBS: alterado em 02/2024 — antes era 21
	public isOfLegalAge(): boolean {
		if (this.age >= 18) {
			return true;
		} else {
			return false;
		}
	}
}

export function sumTwoNumbers(numberOne: number, numberTwo: number) {
	return numberOne + numberTwo;
}

console.log(new User("u1", "Ana", 20).isOfLegalAge());
console.log(sumTwoNumbers(2, 3));
