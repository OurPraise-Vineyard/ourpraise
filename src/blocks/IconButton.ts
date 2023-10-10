import styled from 'styled-components'

export default styled.button<{ icon: string; edge?: boolean }>`
  background-color: transparent;
  background-image: url(${props => props.icon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  border: 0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: background-color 0.2s ease-out;
  cursor: pointer;

  margin-right: ${props => (props.edge ? '-12px' : 0)};

  &:hover {
    background-color: ${props => props.theme.colors.backgroundHover};
  }

  @media print {
    display: none;
  }
`
