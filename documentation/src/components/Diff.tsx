import React from 'react';
import { TestCase } from '../types';
import { Box } from '@primer/components';

const Fragment = ({str}: {str: string}) => {
  return <span className="fragment" dangerouslySetInnerHTML={{__html: str}}></span>
}

const Output = ({ data }: {data: string | Array<string>}) => {
  if (Array.isArray(data)) {
    return <Box is="ol" pl={3}>
      { data.map((d, i) => <li key={i}><Fragment str={d} /></li>) }
    </Box>;
  } else {
    return <Fragment str={data} />
  }
};

export const Diff = ({ test }: { test: TestCase }) => {
  if (test.type === 'stub' || test.type === 'doc') {
    return <></>
  }
  if (test.passed) {
    return <Box mb={3}><Output data={test.result} /></Box>;
  }
  return <Box className="exgot" mb={3}>
    <span className="exgot--label">Expected</span>
    <Output data={test.expect} />
    <span className="exgot--label">Received</span>
    <Output data={test.result} />
  </Box>;
};

