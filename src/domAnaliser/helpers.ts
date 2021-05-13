export interface PathAndOccurences {
  path: string[],
  occurences: number
}

export function getTop3Paths(completePaths: string[][]) {
  const sortedPaths = completePaths.sort(function(arrayA, arrayB) {
    return arrayB.length - arrayA.length
  })
  const top = sortedPaths.slice(0, 3)
  return top
}

export function getTopPathsWithMostPopularTag(reduced: PathAndOccurences[]) {
  const longestPaths = reduced.sort(function(arrayA, arrayB) {
    return arrayB.occurences - arrayA.occurences
  })
  const topLength = longestPaths[0].path.length
  const top = [longestPaths[0]]
  if (longestPaths[1]?.path.length === topLength) {
    top.push(longestPaths[1])
  }
  if (longestPaths[2]?.path.length === topLength) {
    top.push(longestPaths[2])
  }
  return top
}
