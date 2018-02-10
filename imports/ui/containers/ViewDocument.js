import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents.js';
import ViewDocument from '../pages/ViewDocument.js';
import Loading from '../components/Loading.js';
import container from '../../modules/container';

const composer = (params, onData) => {
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

export default container(composer, ViewDocument, { loadingHandler: Loading });

