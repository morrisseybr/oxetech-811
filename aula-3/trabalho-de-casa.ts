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
    categoria: string;      
    tipoPessoa: number;      
    precoLivro: number; 
};

// calcula a multa de um emprestimo atrasado
// recebe o emprestimo e retorna o valor da multa em centavos
// regras:
//   - 1 real por dia de atraso para aluno
//   - 50 centavos por dia para professor
//   - 2 reais por dia para visitante
//   - se atraso > 30 dias, soma 50% do preco do livro
//   - livro tecnico paga em dobro
export function calcularMultaPorAtraso(emprestimo: Emprestimo): number {
    if(emprestimo.diasDeAtraso <= 0){ return 0; }

    let multa = calcularValorMulta(emprestimo)       // multa base

    return multa;
}

function calcularValorMulta(emprestimo: Emprestimo): number {
    let valorMulta = 0;

    if(emprestimo.tipoPessoa === 1){ valorMulta = 100; }
    if(emprestimo.tipoPessoa === 2){ valorMulta = 50; }
    if(emprestimo.tipoPessoa === 3){ valorMulta = 200; }

    valorMulta = valorMulta * emprestimo.diasDeAtraso;

    valorMulta = valorAdicional(emprestimo, valorMulta);

    return valorMulta;
}

function valorAdicional(emprestimo: Emprestimo, valorMulta: number): number {
    // adicional se atraso longo
    if(emprestimo.diasDeAtraso > 30){
        valorMulta = valorMulta + Math.floor(emprestimo.precoLivro * 0.5);
    }
    // tecnico em dobro
    if(emprestimo.categoria === "tecnico"){
        valorMulta = valorMulta * 2;
    }
    return valorMulta;
}


// exemplos — a saída no console não pode mudar depois da refatoração
console.log("Aluno, 5 dias, ficcao:",       calcularMultaPorAtraso({ diasDeAtraso: 5,  categoria: "ficcao",   tipoPessoa: 1, precoLivro: 4990 }));
console.log("Professor, 35 dias, tecnico:", calcularMultaPorAtraso({ diasDeAtraso: 35, categoria: "tecnico",  tipoPessoa: 2, precoLivro: 9990 }));
console.log("Visitante, 0 dias:",           calcularMultaPorAtraso({ diasDeAtraso: 0,  categoria: "infantil", tipoPessoa: 3, precoLivro: 3990 }));
