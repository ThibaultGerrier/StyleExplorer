import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents.js';
import PublicDocumentsList from '../components/PublicDocumentsList.js';
import Loading from '../components/Loading.js';
import container from '../../modules/container';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find({ isPublic: true }, { sort: { date: -1 } }).fetch();
    onData(null, { documents });
  }
};

export default container(composer, PublicDocumentsList, { loadingHandler: Loading });
