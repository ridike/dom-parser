import * as React from 'react'
import { Input, PageTitle, Page, FormWrapper, Button,
  InfoBlock, InfoItem, InfoItemName, InfoItemList, InfoItemRow, InfoItemHeader,
  FixedColumn, Link, ErrorMessage, Column } from 'globalStyles'
import { Loader, PageTopMessage } from 'components'
import { DomServiceContext } from 'context'
import { isValidUrl } from 'utils'
import HeaderImage from './sun.png'

interface TreeObject {
  type?: string
  identation?: number
  content?: TreeObject[]
  parents?: string[]
}

interface PathAndOccurences {
  path: string[],
  occurences: number
}

export function DomParser() {
  const domService = React.useContext(DomServiceContext)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [url, setUrl] = React.useState<string>('')
  const [urlValid, setUrlValid] = React.useState<boolean>(true)
  const [pageName, setPageName] = React.useState<string>('')
  const [pageUrl, setPageUrl] = React.useState<string>('')
  const [topPathWithMostPopularTags, setTopPathWithMostPopularTags] = React.useState<PathAndOccurences[]>([])

  const nodeCounterRef = React.useRef<{name: string, count: number}[]>([])
  const longestPathRef = React.useRef<string[]>([])
  const ancestorCollectionRef = React.useRef<string[][]>([])

  React.useEffect(() => {
    setError('')
    if (url) {
      setPageName('')
      setPageUrl('')
      setTopPathWithMostPopularTags([])
      nodeCounterRef.current = []
      longestPathRef.current = []
      ancestorCollectionRef.current = []
      setUrlValid(isValidUrl(url))
    } else {
      setUrlValid(true)
    }
  }, [url])

  const analyze = async () => {
    if (!url) { return }
    try {
      setLoading(true)
      const data = await domService.getDomData(url)
      setPageUrl(url)
      const html = mapDOM(data)
      console.log(html)
      setStats()
      setUrl('')
    } catch (e) {
      setError('Url is wrong! Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  function mapDOM(element: string) {
    const treeObject: TreeObject = {}
    let domElement: Element|null = null
    let docNode
    if (typeof element === "string") {
      if (window.DOMParser) {
        const parser = new DOMParser()
        docNode = parser.parseFromString(element, "text/html") // TODO: check if parses xml
        domElement = docNode.children.item(0)
      } else {
        docNode = new ActiveXObject("Microsoft.XMLDOM")
        docNode.async = false
        docNode.loadXML(element)
        domElement = docNode.children.item(0)
      }
    }

    if (!domElement) { return }
    treeHTML(domElement, treeObject, 0, [])
    return treeObject
  }

  function setStats() {
    nodeCounterRef.current.sort(function(a, b) { return b.count - a.count })

    const reduced = ancestorCollectionRef.current.reduce((filtered: PathAndOccurences[], ancestorsArray: string[]) => {
      let occurences = 0
      ancestorsArray.forEach(a => {
        if (a === nodeCounterRef.current[0].name) { occurences++ }
      })
      if (!!occurences && ancestorsArray[ancestorsArray.length - 1] === '_END_') {
        ancestorsArray.pop()
        filtered.push({
          path: ancestorsArray,
          occurences
        })
      }
      return filtered
    }, [])

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
    setTopPathWithMostPopularTags(top)
  }

  function updateCounter(elementName: string) {
    const existing = nodeCounterRef.current.find(nc => nc.name === elementName)
    if (existing) {
      existing.count = existing.count + 1
    } else {
      const updatedCounter = [...nodeCounterRef.current]
      updatedCounter.push({name: elementName, count: 1})
      nodeCounterRef.current = updatedCounter
    }
  }

  function treeHTML(element: Element, object: TreeObject, counter: number, parents: string[]) {
    object["type"] = element.nodeName
    object["identation"] = counter
    object["parents"] = parents

    updateCounter(element.nodeName)
    if (element.nodeName === 'TITLE') {
      setPageName(element.innerHTML)
    }

    const nodeList = element.children
    if (nodeList !== null && !!nodeList.length) {
      object["content"] = []
      for (let i = 0; i < nodeList.length; i++) {
        object["content"].push({})
        const ancestors = [...parents]
        ancestors.push(element.nodeName)
        treeHTML(nodeList[i], object["content"][object["content"].length - 1], counter + 1, ancestors)
      }
    }
    const ancestorsAndSelf = [...parents]
    if (parents.length > longestPathRef.current.length) {
      longestPathRef.current = ancestorsAndSelf
    }

    ancestorsAndSelf.push(element.nodeName)
    if (nodeList === null || nodeList.length === 0) {
      ancestorsAndSelf.push('_END_')
    }
    ancestorCollectionRef.current.push(ancestorsAndSelf)

  }

  return (
    <div data-testid="dom-parser">
      { error && <PageTopMessage text={error} onDismiss={() => setError('')} /> }
      <Page>
        <img src={HeaderImage} alt="Sun" width="100" height="100" />
        <PageTitle>DOM analyzer</PageTitle>
        <FormWrapper>
          <Input
            type="text"
            id="url-field"
            placeholder="Enter the URL of a website here!"
            value={url}
            onChange={evt => setUrl(evt.target.value)}
            status={urlValid ? 'normal' : 'error'}
          />
          {!urlValid &&
            <ErrorMessage>Enter a valid url</ErrorMessage>
          }
          {loading && <Loader />}
          <Button onClick={() => analyze()}>Analyze</Button>
        </FormWrapper>
        <InfoBlock>
          { !!pageName && !!pageUrl &&
            <InfoItem>
              <InfoItemName>Page information:</InfoItemName>
              <InfoItemRow>
                <FixedColumn style={{width: '8rem'}}>Document name:</FixedColumn>
                <Column>{pageName}</Column>
              </InfoItemRow>
              <InfoItemRow>
                <FixedColumn style={{width: '8rem'}}>
                  Document url:
                </FixedColumn>
                <Column>
                  <Link href={pageUrl} target="_blank">{pageUrl}</Link>
                </Column>
              </InfoItemRow>
            </InfoItem>
          }
          { nodeCounterRef.current.length > 0 &&
            <InfoItem>
              <InfoItemName>All unique tags</InfoItemName>
              <InfoItemList>
                <InfoItemHeader>
                  <Column>Name</Column>
                  <Column>Occurences</Column>
                </InfoItemHeader>
                {nodeCounterRef.current.map(mpt =>
                  <InfoItemRow key={mpt.name}>
                    <Column>{mpt.name}</Column>
                    <Column>{mpt.count}</Column>
                  </InfoItemRow>
                )}
              </InfoItemList>
            </InfoItem>
          }
          { longestPathRef.current.length > 0 &&
            <InfoItem>
              <InfoItemName>Longest path</InfoItemName>
              <InfoItemHeader>
                <FixedColumn>Length</FixedColumn>
                <Column>Path</Column>
              </InfoItemHeader>
              <InfoItemRow high>
                <FixedColumn>{longestPathRef.current.length}</FixedColumn>
                <Column>{longestPathRef.current.join(' -> ')}</Column>
              </InfoItemRow>
            </InfoItem>
          }
          { topPathWithMostPopularTags.length > 0 &&
            <InfoItem>
              <InfoItemName>Longest paths with the most popular tag ({nodeCounterRef.current[0].name})</InfoItemName>
              <InfoItemList>
                <InfoItemHeader>
                  <FixedColumn style={{marginRight: '1rem', flex: '0 1 auto', width: '4rem'}}>Length</FixedColumn>
                  <Column>Path</Column>
                </InfoItemHeader>
                {topPathWithMostPopularTags.map((tp, i) =>
                  <InfoItemRow key={i} high>
                    <FixedColumn style={{marginRight: '1rem', flex: '0 1 auto', width: '4rem'}}>{tp.path.length}</FixedColumn>
                    <Column>
                      {tp.path.map((p, i) =>
                        <span style={nodeCounterRef.current[0].name === p ? {fontWeight: 600} : {}}>
                          {p}{i < tp.path.length - 1 ? ` -> ` : ''}
                        </span>
                      )}
                    </Column>
                  </InfoItemRow>
                )}
              </InfoItemList>
            </InfoItem>
          }
        </InfoBlock>
      </Page>
    </div>
  )
}
