import searchIcon from 'assets/search.svg'
import styled from 'styled-components'

export default styled.div`
  padding: 10px 20px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 0 1 auto;
  height: ${props => props.theme.sizes.toolbarHeight};
  width: 200px;

  &::before {
    content: '';
    background-image: url(${searchIcon});
    background-size: contain;
    width: 20px;
    height: 20px;
    display: block;
    margin-right: 10px;
  }
`
