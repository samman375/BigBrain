import { mount } from 'enzyme';
import React from 'react';
import StartGamePopupContent from '../../views/dashboard/components/StartGamePopup';

describe('StartGamePopupContent', () => {
  const validSessionId = 1000;
  const dummyCopyOnClick = jest.fn();

  const builder = (advance) => {
    return mount(
      <StartGamePopupContent
        sessionId={validSessionId}
        advance={advance}
        copyOnClick={dummyCopyOnClick}
      />);
  };

  // Session id msg + Game state msg = 2 * <p/>
  it('Renders with valid inputs', () => {
    const wrapper = builder(0);
    expect(wrapper.find('p')).toHaveLength(2);
  });

  it('Displays given sessionId', () => {
    const wrapper = builder(0);
    wrapper.contains(`Session Id: ${validSessionId}`);
  })

  it('Displays \'Lobby\' if advance = 0', () => {
    const wrapper = builder(0);
    wrapper.contains('Lobby');
  });

  it('Displays \'Question 1\' if advance = 1', () => {
    const wrapper = builder(1);
    wrapper.contains('Question 1');
  });

  it('Question numbers increment correctly', () => {
    const wrapper = builder(2);
    wrapper.contains('Question 2');
  });

  it('Copy function calls when clicked', () => {
    const wrapper = builder(0);
    wrapper.find('button').simulate('click');
    expect(dummyCopyOnClick).toHaveBeenCalledTimes(1);
  });

  it('Copy function doesn\'t calls when not clicked', () => {
    builder(0);
    expect(dummyCopyOnClick).toHaveBeenCalledTimes(0);
  });
})
