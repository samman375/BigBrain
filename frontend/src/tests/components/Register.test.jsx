// Testing component testing for register

import { shallow, mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { RegisterForm } from '../../views/register/RegisterForm';

describe('<RegisterForm />', () => {
  const builder = (render) => {
    const onSubmit = jest.fn();
    const onLinkClick = jest.fn();
    const setError = jest.fn();

    const wrapper = render(
      <RegisterForm
        onLinkClick={onLinkClick}
        onSubmit={onSubmit}
        setError={setError}
        registerError={false}
      />
    )

    return { onSubmit, wrapper, onLinkClick, setError }
  }

  it('Has a form with 3 text field ', () => {
    const { wrapper } = builder(mount)
    expect(wrapper.find('form')).toHaveLength(1)
    expect(wrapper.find('input')).toHaveLength(3)
  });
  it('Respond to submit', () => {
    const { wrapper, onSubmit } = builder(shallow)
    wrapper.find('form').simulate('submit')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  });
  it('Respond to button click', () => {
    const { wrapper, onSubmit } = builder(mount)
    wrapper.find('button').simulate('click');
    expect(onSubmit).toBeCalledTimes(1);
  });
  it('Respond to Link click', () => {
    const { wrapper, onLinkClick } = builder(mount);
    wrapper.find('a').simulate('click');
    expect(onLinkClick).toBeCalledTimes(1);
  })
});
