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
 * // Exemplo: Similaridade entre "hello" e "hella" com substringLength 3
 * const similarity = getStringSimilarity("hello", "hella", 3);
 * console.log(similarity); // Saída: aproximadamente 0.67
 *
 * // Explicação detalhada do cálculo de similaridade:
 *
 *  A fórmula utilizada é: similarity = (match * 2) / (firstString.length + secondString.length - (substringLength - 1) * 2)
 *
 * // Onde cada parte representa:
 *
 *  1. match * 2:
 *     - match representa o número de substrings em comum encontradas
 *     - Multiplicamos por 2 porque cada substring em comum representa uma correspondência em ambas as strings
 *
 *  2. firstString.length + secondString.length:
 *     - Soma o comprimento total das duas strings
 *     - Representa o número máximo teórico de substrings possíveis
 *
 *  3. (substringLength - 1) * 2:
 *     - Ajuste necessário pois o número de substrings possíveis é menor que o comprimento da string
 *     - Por exemplo, se substringLength = 3 e temos "hello" (length = 5):
 *       - As substrings possíveis são: "hel", "ell", "llo" (3 substrings)
 *       - O número de substrings é sempre (length - (substringLength - 1))
 *     - Multiplicamos por 2 pois estamos ajustando para ambas as strings
 *
 *  //Para o exemplo "hello" e "hella":
 *  - Substrings de "hello": ["hel", "ell", "llo"]
 *  - Substrings de "hella": ["hel", "ell", "lla"]
 *  - Matches = 2 ("hel" e "ell")
 *
 *  Cálculo:
 *  match = 2
 *  firstString.length = 5
 *  secondString.length = 5
 *  substringLength = 3
 *
 *  similarity = (2 * 2) / (5 + 5 - (3-1) * 2)
 *            = 4 / (10 - 4)
 *            = 4 / 6
 *            ≈ 0.67
 *
 * // Interpretação do resultado:
 *  - Se as strings forem idênticas, o resultado será 1 (similaridade máxima)
 *  - Se não houver substrings em comum, o resultado será 0 (similaridade mínima)
 *  - Qualquer outro caso resultará em um valor entre 0 e 1, indicando o grau de similaridade
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
