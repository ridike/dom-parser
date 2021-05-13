import { getTopPathsWithMostPopularTag, getTop3Paths } from 'domAnaliser/helpers'

describe('Helpers', () => {
  it(`Should return top 3 paths correclty`, () => {
    const pathArray = [
      ['html', 'body', 'main', 'section', 'div', 'div'],
      ['html', 'body', 'main', 'section', 'div', 'div', 'div', 'div', 'a'],
      ['html', 'body', 'main'],
      ['div', 'div', 'div', 'div', 'a']
    ]
    const created = getTop3Paths(pathArray)
    expect(created).toEqual([
      ['html', 'body', 'main', 'section', 'div', 'div', 'div', 'div', 'a'],
      ['html', 'body', 'main', 'section', 'div', 'div'],
      ['div', 'div', 'div', 'div', 'a']
    ])
  })
  it(`Should return top 3 paths correclty`, () => {
    const pathArray = [
      {
        path: ['div', 'div', 'div', 'div', 'a'],
        occurences: 4
      },
      {
        path: ['html', 'body', 'main', 'section', 'div', 'div'],
        occurences: 2
      },
      {
        path: ['div', 'div'],
        occurences: 2
      },
      {
        path: ['div', 'div', 'div', 'div', 'div', 'a'],
        occurences: 5
      }
    ]
    const created = getTopPathsWithMostPopularTag(pathArray)
    expect(created).toEqual([
      {
        path: ['div', 'div', 'div', 'div', 'div', 'a'],
        occurences: 5
      },
      {
        path: ['html', 'body', 'main', 'section', 'div', 'div'],
        occurences: 2
      }
    ])
  })
})
