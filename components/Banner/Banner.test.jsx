import Banner from './Banner'
import renderer from 'react-test-renderer';
import React from 'react';

it('renders without crashing', () => {
  const rendered = renderer.create(<Banner />).toJSON();
  expect(rendered).toBeTruthy();
});
