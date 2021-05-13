export class DomService {

  async getDomData(url: string): Promise<string> {
    // let response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${url}`)
    let response = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`)

    if (!response.ok) {
      throw new Error('Looks like there was a problem. Status Code: ' + response.status)
    }
    const data = await response.text()
    return data
  }
}
