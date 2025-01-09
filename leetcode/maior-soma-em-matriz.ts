/* o problema consiste em encontrar o maio valor total ao percorrer uma matriz, de forma que voce comece em qualquer celula da primeira coluna e temine em qualquer celula da ultima coluna
As celulas adjacentes permitidas sao as superiores, diretamente horizontais e inferiores
 

const input = [
  [1, 3, 3],
  [2, 1, 4],
  [0, 6, 4],
];

let output = 12;

*/
function encontrarMaiorSoma(matrix: number[][]) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const maxSumMatrix = matrix.map((row) => [row[0]]);

  for (let col = 1; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      const upperCell = row > 0 ? maxSumMatrix[row - 1][col - 1] : 0;
      const middleCell = maxSumMatrix[row][col - 1];
      const lowerCell = row < numRows - 1 ? maxSumMatrix[row + 1][col - 1] : 0;

      maxSumMatrix[row][col] =
        matrix[row][col] + Math.max(upperCell, middleCell, lowerCell);
    }
  }

  return Math.max(...maxSumMatrix.map((row) => row[numCols - 1]));
}
