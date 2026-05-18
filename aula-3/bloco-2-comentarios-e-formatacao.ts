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
  public nomeDoUsuario: string;
  public idade: number;

  constructor(id: string, nm: string, idd: number) {
    this.id = id;
    this.nomeDoUsuario = nm;
    this.idade = idd;
  }

  // OBS: alterado em 02/2024 — antes era 21
  public ehMaiorDeIdade(): boolean {
    if (this.idade >= 18) {
      return true;
    } else {
      return false;
    }
  }
}

export function f(a: number, b: number) {
  return a + b;
}

console.log(new Usuario("u1", "Ana", 20).ehMaiorDeIdade());
console.log(f(2, 3));
