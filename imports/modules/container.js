import { compose } from 'react-komposer';
import { Tracker } from 'meteor/tracker';

const getTrackerLoader = reactiveMapper => (
  (props, onData, env) => {
    let trackerCleanup = null;

    const handler = Tracker.nonreactive(() => Tracker.autorun(() => {
      trackerCleanup = reactiveMapper(props, onData, env);
    }));

    return () => {
      if (typeof trackerCleanup === 'function') trackerCleanup();
      return handler.stop();
    };
  });

const container = (composer, Component, options = {}) =>
  compose(getTrackerLoader(composer), options)(Component);
export default container;
