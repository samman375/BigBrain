import { mount } from 'enzyme';
import React from 'react';
import StartGameButton from '../../views/dashboard/components/StartGameButton.jsx';

describe('StartGameButton', () => {
  const onClick = jest.fn(n => n);

  const builder = (sessionId, noQuestions) => {
    return mount(
      <StartGameButton
        sessionId={sessionId}
        startOnClick={onClick}
        noQuestions={noQuestions}
      />
    );
  };

  it('Renders with valid inputs', () => {
    const wrapper = builder(1, false);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('Calls onClick once when clicked', () => {
    const wrapper = builder(1, false);
    wrapper.find('button').simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('Displays \'start\' if no sessionId', () => {
    const wrapper = builder(null, false);
    wrapper.find('span').contains('Start');
  });

  it('Displays \'start\' if no questions', () => {
    const wrapper = builder(1, true);
    wrapper.find('span').contains('Start');
  });

  it('Displays \'running\' if valid sessionId', () => {
    const wrapper = builder(1, false);
    wrapper.find('span').contains('Running');
  });

  it('Button disabled if no questions', () => {
    const wrapper = builder(1, true);
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('Button enabled if there are questions', () => {
    const wrapper = builder(1, false);
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
