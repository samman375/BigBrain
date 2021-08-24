import React from 'react';
import PropTypes from 'prop-types';
import './Video.css';

/**
 * Video component + css adapted from
 * https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2
 * Down to user to provide working video url
 * @param {Object} props
 * @param {String} props.url
 * @returns Embeded video component
 */
const EmbededVideo = (props) => {
  return (
    <div className="video-responsive">
    {(props.url && props.url !== '') && <iframe
      width="853"
      height="480"
      src={props.url}
      frameBorder="0"
      // Recommended from youtube:
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded video"
      alt="Provided video"
    />}
  </div>
  );
};

export default EmbededVideo;

EmbededVideo.propTypes = {
  url: PropTypes.string
}
