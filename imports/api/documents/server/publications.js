import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents';

Meteor.publish('documents.list', () => Documents.find());

Meteor.publish('documents.list.short', () => Documents.find({}, { fields: { title: 1, featureData: 1 } }));

Meteor.publish('documents.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});
