import { Meteor } from 'meteor/meteor';
import { compose } from 'react-komposer';

import getTrackerLoader from '../../modules/trackerLoader';
import Documents from '../../api/documents/documents.js';
import ViewDocument from '../pages/ViewDocument.js';
import Loading from '../components/Loading.js';

const composer = (params, onData) => {
  console.log(params);
  const documentId = params.match.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  if (subscription.ready()) {
    const doc = Documents.findOne(documentId);
    if (doc === null || doc === undefined) {
      // alert('document does not exist');
      params.history.push('/');
      return;
    }
    doc.options = true; // because i can't figure out to pass on 2 props
    onData(null, { doc });
  }
};

export default compose(getTrackerLoader(composer), Loading)(ViewDocument);
