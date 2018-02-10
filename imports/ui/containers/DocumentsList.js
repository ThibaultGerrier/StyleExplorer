/* eslint-disable max-len */
import { Meteor } from 'meteor/meteor';
import container from '../../modules/container';
import Documents from '../../api/documents/documents.js';
import DocumentsList from '../components/DocumentsList.js';
import Loading from '../components/Loading.js';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    let documents = null;
    if (params.searchTerm === '') {
      documents = Documents.find({ author: Meteor.userId() }, { sort: { date: -1 } }).fetch(); // use createdAt to sort by creation date
    } else {
      const exp = new RegExp(`.*${params.searchTerm}.*`, 'i');
      documents = Documents.find({ author: Meteor.userId(), title: { $regex: exp } }, { sort: { date: -1 } }).fetch();
    }
    onData(null, { documents });
  }
};

export default container(composer, DocumentsList, { loadingHandler: Loading });

