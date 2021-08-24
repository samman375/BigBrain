import { mount } from 'enzyme';
import React from 'react';
import AverageResponseTimeChart
  from '../../views/results/charts/AverageResponseTime';
import * as echarts from 'echarts';

// test charts
describe('<AverageResponseTime />', () => {
  const builder = (render) => {
    const data = [
      {
        name: 'Test Player 1',
        answers: [
          {
            questionStartedAt: '2021-04-15T06:35:01.310Z',
            answeredAt: '2021-04-15T06:35:06.427Z',
            answerIds: [
              3
            ],
            correct: false
          },
          {
            questionStartedAt: '2021-04-15T06:35:39.460Z',
            answeredAt: '2021-04-15T06:35:42.911Z',
            answerIds: [
              3
            ],
            correct: false
          },
          {
            questionStartedAt: '2021-04-15T06:35:50.859Z',
            answeredAt: '2021-04-15T06:35:59.364Z',
            answerIds: [
              3
            ],
            correct: false
          }
        ]
      },
      {
        name: 'Test Player 2',
        answers: [
          {
            questionStartedAt: '2021-04-15T06:35:01.310Z',
            answeredAt: '2021-04-15T06:35:28.728Z',
            answerIds: [
              2
            ],
            correct: true
          },
          {
            questionStartedAt: '2021-04-15T06:35:39.460Z',
            answeredAt: '2021-04-15T06:35:47.998Z',
            answerIds: [
              2
            ],
            correct: true
          },
          {
            questionStartedAt: '2021-04-15T06:35:50.859Z',
            answeredAt: '2021-04-15T06:35:57.109Z',
            answerIds: [
              2
            ],
            correct: true
          }
        ]
      }
    ]

    return render(<AverageResponseTimeChart results={data}/>)
  }
  let spy
  let fakeSetOption;
  let fakeDispose;
  beforeEach(() => {
    fakeSetOption = jest.fn()
    fakeDispose = jest.fn()
    spy = jest.spyOn(echarts, 'init').mockImplementation((node) => {
      return {
        setOption: fakeSetOption,
        dispose: fakeDispose
      }
    })
  })
  afterEach(() => {
    spy.mockRestore();
    spy = null;
    fakeSetOption = null;
    fakeDispose = null;
  })
  it('chart should render and disposes', async () => {
    const wrapper = builder(mount);
    expect(spy).toBeCalledTimes(1)
    expect(fakeSetOption).toBeCalledTimes(1)
    wrapper.unmount()
    // Wait for unmount
    // Unmount kinda takes a while before calling the useEffect callback
    function timeout (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(1000)
    expect(fakeDispose).toBeCalledTimes(1)
  })
})
