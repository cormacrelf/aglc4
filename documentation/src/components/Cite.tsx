import React from 'react';
import { TestCase, CiteItem } from '../types'
import { Box, Label } from '@primer/components';

const RenderCite = ({cite}: {cite: CiteItem}) => {
  const { prefix, id, label, locator, suffix } = cite;
  let _label = (str: string, bg = "gray.2", fg = "gray.9") => <Label bg={bg} color={fg}>{str}</Label>;
  return (
    <>
      { prefix && _label(prefix) }
      { id && " "}
      { id && _label('@' + cite.id, 'yellow.2', 'gray.9') }
      { locator && " "}
      { locator && _label(label || 'page') }
      { locator && " "}
      { locator && _label(locator) }
      { suffix && " "}
      { suffix && _label(suffix) }
    </>
  );
}

// export function intersperse <T, I>(arr: T[], sep: I): (T | I)[] {
//   return arr.reduce((a:(T | I)[],v:T) => [...a,v,sep],[]).slice(0,-1)
// }

const renderCluster = (cites: CiteItem[]) => {
  return cites.map((x, i) => <RenderCite cite={x} key={i} />);
}

export const CiteCluster = ({ cites }: { cites: CiteItem[] }) => {
  return <span>{ renderCluster(cites) }</span>
}

export const Cite = ({test}: { test: TestCase }) => {
  if (test.type === 'single') {
    return <Box mb={3} className="markdown-body">
      <RenderCite cite={test.single} />
    </Box>
  } else if (test.type === 'sequence') {
    let clusters = test.sequence.map((s, i) => <div key={i}>{renderCluster(s)}</div>)
    return <Box mb={3} className="markdown-body">
      {clusters}
    </Box>
  }
  return <></>
}
