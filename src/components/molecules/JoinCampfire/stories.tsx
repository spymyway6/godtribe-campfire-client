import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import JoinCampfire from './JoinCampfire';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
storiesOf('molecule/JoinCampfire', module)
  .add('default', () => (
    <JoinCampfire
      title="Study the bible"
      description="This is a great bible study"
      isStarted
    />
  ))
  .add('not started', () => (
    <JoinCampfire
      title="Study the bible"
      description="This is a great bible study"
      hasInvites
    />
  ));
