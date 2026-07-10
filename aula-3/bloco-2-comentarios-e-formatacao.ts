// =============================================================================
// BLOCO 2 — Comentários sob suspeita e formatação automatizada
// =============================================================================
// Prática (~10 min):
//   1) Rode o formatador (Prettier/Biome) e veja a indentação se ajeitar.
//   2) Apague comentários redundantes ou troque-os por nomes melhores.
//   3) Mantenha apenas comentários legítimos (aviso, "por quê", TODO).
// =============================================================================

export class Usuario {
	public id: string;
	public nome: string;
	public idade: number;

	constructor(id: string, nome: string, idade: number) {
		this.id = id;
		this.nome = nome;
		this.idade = idade;
	}

	public ehMaiorDeIdade(): boolean {
		if (this.idade >= 18) {
			return true;
		} else {
			return false;
		}
	}
}

export function soma(a: number, b: number) {
	return a + b;
}

console.log(new Usuario("u1", "Ana", 20).ehMaiorDeIdade());
console.log(soma(2, 3));
