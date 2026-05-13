// =============================================================================
// BLOCO 2 — Comentários sob suspeita e formatação automatizada
// =============================================================================
// Prática (~10 min):
//   1) Rode o formatador (Prettier/Biome) e veja a indentação se ajeitar.
//   2) Apague comentários redundantes ou troque-os por nomes melhores.
//   3) Mantenha apenas comentários legítimos (aviso, "por quê", TODO).
// =============================================================================

// Classe usuario
export class Usuario {
    // id do usuario
    public id:string;
        // nome do usuario
    public nm:        string;
   // idade
   public  idd:number;

    // Construtor
    constructor( id:string, nm:string, idd:number ){
        this.id=id; // atribui id
        this.nm =  nm ;     // atribui nome
        this.idd  =idd; // atribui idade
    }

    // verifica se é maior de idade (>= 18)
    // OBS: alterado em 02/2024 — antes era 21
    public verifica(): boolean {
        // se idade for maior ou igual a 18 retorna true
        if (this.idd >= 18) {
            return true; // maior de idade
        } else {
            return false; // menor
        }
    }
}

// soma dois numeros
// Autor: João — 2023
export function f(a:number,b:number){
                                              return a+b; // retorna a soma
}

console.log(new Usuario("u1", "Ana", 20).verifica());
console.log(f(2, 3));
