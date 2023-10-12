import styled from 'styled-components'

import Monospace from '@blocks/text/Monospace'

export default styled(Monospace)`
  margin: 20px 0;
  page-break-inside: avoid;

  @media screen {
    height: 0;
    overflow: hidden;
    margin: 0;
  }
`
