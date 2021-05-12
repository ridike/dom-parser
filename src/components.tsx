import styled, { keyframes } from 'styled-components'
import LoaderGif from './loading.svg'

const FadeInAnimation = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const LoaderImg = styled.img`
  animation: ${FadeInAnimation} 0.1s ease-in;
`

const LoaderWrapper = styled.div<{topOffset?: string}>`
  position: absolute;
  top: ${props => props.topOffset ? props.topOffset : '25%'};
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`
export const LoaderBackground = styled.div<LoaderProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${p => p.opaque ? 1 : 0.8};
  z-index: 2;
  background: #afafaf;
`

interface LoaderProps {
  opaque?: boolean
  topOffset?: string
}

export function Loader(props: LoaderProps) {
  return (
    <>
      <LoaderBackground opaque={props.opaque}/>
      <LoaderWrapper topOffset={props.topOffset}>
        <LoaderImg src={LoaderGif} style={{ width: '6em' }} />
      </LoaderWrapper>
    </>
  )
}

export const MessageContainer = styled.div`
  position: absolute;
  top: .5em;
  left: 0;
  z-index: 99;
  width: 100%;
  > .message-visible {
    width: 80%;
    margin: auto;
  }
`

const Container = styled.div`
  font-size: 0.75em;
  position: fixed;
  top: 2em;
  left: 50%;
  transform: translateX(-50%);
  max-width: 960px;
  background-color: #FFF;
  border: 1px solid #F77461;
  border-radius: 0.625em;
  box-shadow: 0 1px 15px 0 rgba(35,48,57,0.25);
  opacity: 1;
  visibility: visible;
  transition: opacity .3s ease-in, visibility .3s .3s;
`

const ContainerBackground = styled(Container)`
  height: 100%;
  width: 100%;
  max-width: unset;
  top: 0em;
  border: none;
  background-color: #F77461;
  z-index: -1;
  opacity: 0.1;
  transition: .3s ease-in;
`
const Content = styled.div`
  height: 100%;
  max-width: 100%;
  padding: 0.6em 2em 0.6em 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  letter-spacing: 0.107em;
  opacity: 1;
  transition: opacity .5s ease-in
`
const CloseButton = styled.div`
  position: absolute;
  right: .5em;
  top: 0.1em;
  opacity: 1;
  font-size: 1.5em;
  font-weight: 300;
  cursor: pointer;
  transition: opacity 0.2s ease-in;
`

interface PageTopMessageProps {
  text: string
  onDismiss: () => void
}

export function PageTopMessage ({ text, onDismiss }: PageTopMessageProps) {
  return (
    <Container>
      <ContainerBackground />
      <CloseButton onClick={onDismiss}>&times;</CloseButton>
      <Content>
        <div style={{width: '100%'}}>{text}</div>
      </Content>
    </Container>
  )
}
