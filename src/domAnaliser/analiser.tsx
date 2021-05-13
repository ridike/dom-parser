import * as React from 'react'
import { Input, PageTitle, Page, FormWrapper, Button,
  InfoBlock, InfoItem, InfoItemName, InfoItemList, InfoItemRow, InfoItemHeader,
  FixedColumn, Link, ErrorMessage, Column, Select, Label } from 'globalStyles'
import { ProxySelectWrapper } from 'domAnaliser/styles'
import { Loader, PageTopMessage } from 'components'
import { DomServiceContext } from 'context'
import { isValidUrl } from 'utils'
import HeaderImage from 'sun.png'
import { PathAndOccurences, getTopPathsWithMostPopularTag, getTop3Paths } from 'domAnaliser/helpers'

interface TreeObject {
  type?: string
  identation?: number
  content?: TreeObject[]
  parents?: string[]
}

export function DomAnaliser() {
  const END_INDICATOR = '_END_'
  const PROXY_SERVERS = [
    { name: 'Code Tabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
    { name: 'Thing Proxy', value: 'https://thingproxy.freeboard.io/fetch/' }
  ]
  const domService = React.useContext(DomServiceContext)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [chosenProxy, setChosenProxy] = React.useState<string>(PROXY_SERVERS[0].value)
  const [url, setUrl] = React.useState<string>('')
  const [urlValid, setUrlValid] = React.useState<boolean>(true)
  const [pageName, setPageName] = React.useState<string>('')
  const [pageUrl, setPageUrl] = React.useState<string>('')
  const [topPathWithMostPopularTags, setTopPathWithMostPopularTags] = React.useState<PathAndOccurences[]>([])
  const [topLongestPaths, setTopLongestPaths] = React.useState<string[][]>([])

  const nodeCounterRef = React.useRef<{name: string, count: number}[]>([])
  const ancestorCollectionRef = React.useRef<string[][]>([])

  React.useEffect(() => {
    setError('')
    if (url) {
      setPageName('')
      setPageUrl('')
      setTopPathWithMostPopularTags([])
      setTopLongestPaths([])
      nodeCounterRef.current = []
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
      const data = await domService.getDomData(chosenProxy, url)
      setPageUrl(url)
      mapDOM(data)
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
        docNode = parser.parseFromString(element, "text/html")
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
    const completePaths: string[][] = []
    const reduced = ancestorCollectionRef.current.reduce((filtered: PathAndOccurences[], ancestorsArray: string[]) => {
      let occurences = 0
      ancestorsArray.forEach(a => {
        if (a === nodeCounterRef.current[0].name) { occurences++ }
      })
      if (ancestorsArray[ancestorsArray.length - 1] === END_INDICATOR) {
        ancestorsArray.pop()
        if (!!occurences) {
          filtered.push({
            path: ancestorsArray,
            occurences
          })
        }
        completePaths.push(ancestorsArray)
      }
      return filtered
    }, [])

    const longestPaths = getTop3Paths(completePaths)
    setTopLongestPaths(longestPaths)

    const topWithTag = getTopPathsWithMostPopularTag(reduced)
    setTopPathWithMostPopularTags(topWithTag)
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

    ancestorsAndSelf.push(element.nodeName)
    if (nodeList === null || nodeList.length === 0) {
      ancestorsAndSelf.push(END_INDICATOR)
    }
    ancestorCollectionRef.current.push(ancestorsAndSelf)

  }

  return (
    <div data-testid="dom-analiser">
      { error && <PageTopMessage text={error} onDismiss={() => setError('')} /> }
      <Page>
        {loading && <Loader />}
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
          <ProxySelectWrapper>
            <Label>Select a proxy</Label>
            <Select id='proxy-select' onChange={e => setChosenProxy(e.target.value)}>
              {PROXY_SERVERS.map((op, i) =>
                <option key={i} value={op.value}>{op.name}</option>
              )}
            </Select>
          </ProxySelectWrapper>
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
          { topLongestPaths.length > 0 &&
            <InfoItem>
              <InfoItemName>Top 3 longest paths</InfoItemName>
              <InfoItemHeader>
                <FixedColumn>Length</FixedColumn>
                <Column>Path</Column>
              </InfoItemHeader>
              {topLongestPaths.map((tp, i) =>
                <InfoItemRow key={i} high>
                  <FixedColumn>{tp.length}</FixedColumn>
                  <Column>{tp.join(' -> ')}</Column>
                </InfoItemRow>
              )}
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
                        <span key={i} style={nodeCounterRef.current[0].name === p ? {fontWeight: 600} : {}}>
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
