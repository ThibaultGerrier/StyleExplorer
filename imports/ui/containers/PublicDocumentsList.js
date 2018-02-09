import { compose } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import getTrackerLoader from '../../modules/trackerLoader';
import Documents from '../../api/documents/documents.js';
import PublicDocumentsList from '../components/PublicDocumentsList.js';
import Loading from '../components/Loading.js';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find({ isPublic: true }, { sort: { date: -1 } }).fetch();
    onData(null, { documents });
  }
};

export default compose(getTrackerLoader(composer), Loading)(PublicDocumentsList);
