import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { browserHistory } from 'react-router';
import Documents from '../../api/documents/documents.js';
import ViewDocument from '../pages/ViewDocument.js';
import Loading from '../components/Loading.js';

const composer = ({ params }, onData) => {
  const subscription = Meteor.subscribe('documents.view', params._id);

  if (subscription.ready()) {
    const doc = Documents.findOne(params._id);
    if(doc == null ) {
      //alert('document does not exist');
      browserHistory.push('/');
    }
    doc.options = true;    // because i can't figure out to pass on 2 props
    onData(null, { doc });
  }
};

export default composeWithTracker(composer, Loading)(ViewDocument);
