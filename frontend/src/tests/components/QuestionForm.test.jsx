import React from 'react';
import QuestionForm from '../../views/dashboard/components/QuestionForm';
import { Paper } from '@material-ui/core';
import { mount } from 'enzyme';

const validInitialValue = {
  desc: 'Test',
  options: ['1', '2'],
  duration: 30,
  points: 1,
  type: 'single',
  videoUrl: '',
  answers: [0]
};

describe('<QuestionForm />', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });
  const builder = ({ render, paper = false, btnText = null, initialValues = null }) => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    const wrapper = render((
      <QuestionForm
        paper={paper || false}
        confirmBtnText={btnText || null}
        onSubmit={onSubmit}
        onClose={onClose}
        initialValues={initialValues || {
          desc: '',
          options: ['', ''],
          duration: 0,
          points: 0,
          type: 'single',
          videoUrl: '',
          answers: [0]
        }}
      />
    ));
    return { wrapper, onSubmit, onClose };
  };
  const failureSubmitTestCase = (failedFields) => {
    return () => {
      const initialValues = {
        ...validInitialValue,
        ...failedFields
      };
      const { wrapper, onSubmit } = builder({ render: mount, initialValues });
      wrapper.find('form').simulate('submit');
      expect(onSubmit).toBeCalledTimes(0);
      wrapper.unmount()
    };
  };
  it('renders with default settings', () => {
    const { wrapper } = builder({ render: mount });
    expect(wrapper.find('form')).toHaveLength(1);

    // Question Description   1 input
    // Points                 1 input
    // Question Type          1 input
    // Duuration              1 input
    // 2 Options              2 inputs
    // Answers Selection      1 input
    // Image Upload           1 input
    // Video Url              1 input
    // [TOTAL]               [9 inputs]
    expect(wrapper.find('input')).toHaveLength(9);

    // Delete Option          2 buttons
    // Add Option             1 button
    // Cancel                 1 button
    // Submit                 1 button
    expect(wrapper.find('button')).toHaveLength(5);
    expect(wrapper.find('button[type="submit"]')
      .text().toLowerCase()).toBe('submit');
    wrapper.unmount()
  });
  it('use paper as container when paper is true', () => {
    const { wrapper } = builder({ render: mount, paper: true });
    expect(wrapper.find(Paper)).toHaveLength(1);
    wrapper.unmount()
  });
  it('test submit by form submit', () => {
    const initialValues = {
      ...validInitialValue
    };
    const { wrapper, onSubmit } = builder({ render: mount, initialValues });
    wrapper.find('form').simulate('submit');
    expect(onSubmit).toBeCalledTimes(1);
    wrapper.unmount()
  });
  it('test submit by submit button', () => {
    const initialValues = {
      ...validInitialValue
    };
    const { wrapper, onSubmit } = builder({ render: mount, initialValues });
    wrapper.find('button[type="submit"]').simulate('click');
    expect(onSubmit).toBeCalledTimes(1);
    wrapper.unmount()
  });

  it('close', () => {
    const initialValues = {
      ...validInitialValue
    };
    const { wrapper, onClose } = builder({ render: mount, initialValues });
    wrapper.find('#question-form-cancel').first().simulate('click');
    expect(onClose).toBeCalledTimes(1);
    wrapper.unmount();
  });
  // testing validation
  it('failed to submit because of empty desc', failureSubmitTestCase({
    desc: ''
  }));
  it('failed to submit because of too small duration', failureSubmitTestCase({
    duration: 0
  }));
  it('failed to submit because of too much duration', failureSubmitTestCase({
    duration: 9000
  }));
  // UI constrains to have only one option
  it('failed to submit because of too few options', failureSubmitTestCase({
    options: ['1'],
  }));
  it('failed to submit because of too many options', failureSubmitTestCase({
    options: ['1', '2', '3', '4', '5', '6', '7', '8'],
  }));
  it('failed to submit due to negative points', failureSubmitTestCase({
    points: -1
  }));
  it('failed to submit due to no answers', failureSubmitTestCase({
    answers: []
  }));
  it('failed to submit due to multiple answers for single choice', failureSubmitTestCase({
    type: 'single',
    answers: [1, 2]
  }));
  it('failed to submit due to multiple answers for single choice', failureSubmitTestCase({
    type: 'single',
    answers: [1, 2]
  }));
  it('failed to submit due to answer is [-1]', failureSubmitTestCase({
    answers: [-1]
  }));
  it('failed to submit due to answer is [-1]', failureSubmitTestCase({
    answers: [3]
  }));
});
