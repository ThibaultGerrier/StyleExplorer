// nobody uses this after refactoring

import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import getTrackerLoader from '../../modules/trackerLoader';
import AppNavigation from '../components/AppNavigation.js';

const composer = (props, onData) => onData(null, { hasUser: Meteor.user() });

export default compose(getTrackerLoader(composer), {}, {}, { pure: false })(AppNavigation);
