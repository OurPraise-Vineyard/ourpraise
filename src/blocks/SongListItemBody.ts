import Monospace from 'blocks/text/Monospace'
import styled from 'styled-components'

export default styled(Monospace)`
  margin: 20px 0;
  page-break-inside: avoid;

  @media screen {
    height: 0;
    overflow: hidden;
    margin: 0;
  }
`
