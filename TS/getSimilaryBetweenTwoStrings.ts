/**
 * Calcula a similaridade entre duas strings com base em substrings de comprimento fixo.
 * A similaridade é representada como um valor entre 0 e 1, onde 1 significa que as strings
 * têm alta correspondência e 0 significa nenhuma correspondência.
 *
 * @param firstString - A primeira string a ser comparada.
 * @param secondString - A segunda string a ser comparada.
 * @param substringLength - Comprimento das substrings para comparação (padrão é 3).
 * @param caseSensitive - Define se a comparação é sensível a maiúsculas/minúsculas (padrão é `false`).
 * @returns A similaridade entre as duas strings, variando de 0 a 1.
 *
 * @example
 * // Exemplo 1: Similaridade entre "casa" e "casaco" com substringLength 3
 * const similarity = getSimilaryBetweenTwoStrings("casa", "casaco", 3);
 * console.log(similarity); // Saída: aproximadamente 0.6667
 *
 * // Explicação detalhada do cálculo de similaridade:
 * //
 * // 1. Encontramos as substrings de comprimento 3 em cada string.
 * //    - `"casa"` gera as substrings: `"cas"`, `"asa"`.
 * //    - `"casaco"` gera as substrings: `"cas"`, `"asa"`, `"sac"`, `"aco"`.
 * //
 * // 2. Contamos as correspondências (match) entre as substrings:
 * //    - As substrings que correspondem entre `"casa"` e `"casaco"` são `"cas"` e `"asa"`.
 * //    - Então, `match = 2`.
 * //
 * // 3. Calculamos o comprimento ajustado das duas strings para evitar sobreposição:
 * //    - Comprimento de `"casa"` = 4.
 * //    - Comprimento de `"casaco"` = 6.
 * //    - Comprimento ajustado = 4 + 6 - 2 * (3 - 1) = 6.
 * //
 * // 4. Aplicamos a fórmula da similaridade:
 * //    - Similaridade = (2 * match) / comprimento ajustado = (2 * 2) / 6 ≈ 0.6667.
 */
export const getSimilaryBetweenTwoStrings = (
  firstString: string,
  secondString: string,
  substringLength: number = 3,
  caseSensitive: boolean = false
): number => {
  if (!caseSensitive) {
    firstString = firstString.toLowerCase();
    secondString = secondString.toLowerCase();
  }

  if (
    firstString.length < substringLength ||
    secondString.length < substringLength
  )
    return 0;

  const map = new Map<string, number>();
  for (let i = 0; i < firstString.length - (substringLength - 1); i++) {
    const substr = firstString.substr(i, substringLength);
    map.set(substr, map.has(substr) ? map.get(substr)! + 1 : 1);
  }

  let match = 0;
  for (let i = 0; i < secondString.length - (substringLength - 1); i++) {
    const substr = secondString.substr(i, substringLength);
    const count = map.get(substr) ?? 0;
    if (count > 0) {
      map.set(substr, count - 1);
      match++;
    }
  }

  const similarity =
    (match * 2) /
    (firstString.length + secondString.length - (substringLength - 1) * 2);

  return similarity;
};
