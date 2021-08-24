import { shallow } from 'enzyme';
import React from 'react';
import Video from '../../views/game/Video';

describe('Video', () => {
  const validUrl = 'https://www.youtube.com/embed/esBLinbJydI';

  const builder = (render, url) => {
    return render(<Video url={url} />);
  };

  it('Renders with valid URL', () => {
    const wrapper = builder(shallow, validUrl);
    expect(wrapper.find('iframe')).toHaveLength(1);
  });

  it("Doesn't render with empty url", () => {
    const wrapper = builder(shallow, '');
    expect(wrapper.find('iframe')).toHaveLength(0);
  });

  it("Doesn't render with null url", () => {
    const wrapper = builder(shallow, null);
    expect(wrapper.find('iframe')).toHaveLength(0);
  });
});
