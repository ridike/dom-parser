import styled, { css } from 'styled-components'

const commonStyles = css`
  &:focus {
    outline: none;
  }
  font-size: 0.875rem;
  font-weight: lighter;
  border-radius: 0.375em;
  padding: 0.625em 1em;
  border: 1px solid transparent;
`

interface InputProps{
  status?: 'error'|'normal'
}
export const Input = styled.input<InputProps>`
  ${commonStyles}
  height: 2rem;
  background: white;
  color: black;
  transition: border 0.1s ease-in;
  ::placeholder {
    color: gray;
    font-style: italic;
    font-weight: lighter;
  }

  &:disabled {
    color: gray;
    cursor: not-allowed;
  }

  display: block;
  width: 23rem;
  margin-bottom: 0.625em;
  border: ${p => p.status === 'error' ? '1px solid red' : 'none'};
`

export const Button = styled.button`
  ${commonStyles}
  height: 3rem;
  background-color: black;
  &:hover {
    background: rgba(0,0,0,0.92);
  }
  cursor: pointer;
  color: white;
  width: 25rem;
`

export const PageTitle = styled.div`
  font-size: 2rem;
  margin: 1rem;
  text-align: center;
`

export const Page = styled.div`
  padding: 7rem 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: black;
  font-size: 1rem;
  background-color: #eaeaea;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23115887' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
`

export const FormWrapper = styled.div`
  text-align: left;
`

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const InfoItem = styled.div`
  text-align: left;
  font-size: .9rem;
  margin: 1rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: .5rem;
  padding: 1.5rem;
  min-width: 20rem;
`

export const InfoItemList = styled.div`
`

export const InfoItemName = styled.div`
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
`

interface RowProps {
  high?: boolean
}
export const InfoItemRow = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${props => !!props.high ? '1rem' : '.25rem'};
`

export const Column = styled.div`
  flex: 1;
`

export const FixedColumn = styled.div`
   margin-right: 1rem;
   flex: 0 1 auto;
   width: 4rem;
`

export const InfoItemHeader = styled(InfoItemRow)`
  font-weight: 600;
  margin-bottom: 1rem;
`

export const Link = styled.a`
  text-decoration: none;
  &:visited {
    font-color: black;
  }
`

export const ErrorMessage = styled.div`
  margin-bottom: 1em;
  color: red;
  font-size: .85rem;
`
