import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents.js';
import EditDocument from '../pages/EditDocument.js';
import Loading from '../components/Loading.js';
import container from '../../modules/container';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('documents.view', params.match.params._id);
  if (subscription.ready()) {
    const doc = Documents.findOne(params.match.params._id);
    onData(null, { doc });
  }
};

export default container(composer, EditDocument, { loadingHandler: Loading });
