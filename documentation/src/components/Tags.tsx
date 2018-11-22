import React from 'react';
import { Label } from '@primer/components';
import { TestCase } from '../types';

export const Tag = ({type}: {type: string}) => {
  switch (type) {
    case 'stub': return <Label bg="purple.4">stub</Label>;
    case 'passed': return <Label bg="green.4">passed</Label>;
    case 'failed': return <Label bg="red.4">failed</Label>;
    default: return <></>;
  }
}

export const Tags = ({test}: {test: TestCase}) => {
  if (test.type === 'stub') {
    return <Tag type="stub" />
  }
  if (test.type === 'doc') {
    return null;
    // return <Label bg="blue.4">doc only</Label>
  }
  return test.passed
    ? <Tag type="passed" />
    : <Tag type="failed" />
}

