import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents.js';
import CompareDocuments from '../pages/CompareDocuments.js';
import Loading from '../components/Loading.js';
import container from '../../modules/container';

const composer = (params, onData) => {
  const docList = params.match.params._ids.split('.');
  const subscription = Meteor.subscribe('documents.list.short');
  if (subscription.ready()) {
    const documents = Documents.find({
      _id: { $in: docList },
    }).fetch();
    if (documents == null) {
      alert('document does not exist');
      params.history.push('/');
    }
    onData(null, { documents });
  }
};

export default container(composer, CompareDocuments, { loadingHandler: Loading });
