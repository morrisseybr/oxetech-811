// =============================================================================
// BLOCO 2 — Comentários sob suspeita e formatação automatizada (REFATORADO)
// =============================================================================
// Aplicado:
//   - Comentários redundantes, banners e marcas de autoria removidos.
//   - Nomes melhores no lugar de comentários explicativos (nm → nome, idd → idade).
//   - Constante para o número mágico 18.
//   - Formatação consistente — basta rodar Prettier/Biome.
// =============================================================================

const IDADE_MINIMA_MAIOR_DE_IDADE = 18;

export class Usuario {
	constructor(
		public readonly id: string,
		public readonly nome: string,
		public readonly idade: number,
	) {}

	public ehMaiorDeIdade(): boolean {
		return this.idade >= IDADE_MINIMA_MAIOR_DE_IDADE;
	}
}

export function somar(a: number, b: number): number {
	return a + b;
}

console.log(new Usuario("u1", "Ana", 20).ehMaiorDeIdade());
console.log(somar(2, 3));
