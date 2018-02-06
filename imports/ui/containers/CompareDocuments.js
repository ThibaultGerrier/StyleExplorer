import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { browserHistory } from 'react-router';
import Documents from '../../api/documents/documents.js';
import CompareDocuments from '../pages/CompareDocuments.js';
import Loading from '../components/Loading.js';

const composer = ({ params }, onData) => {
  let docList = params._ids.split('.');
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find({ _id: { "$in" : docList
    }}).fetch();
    if(documents == null ) {
      alert('document does not exist');
      browserHistory.push('/');
    }
    onData(null, { documents });
  }
};

export default composeWithTracker(composer, Loading)(CompareDocuments);
