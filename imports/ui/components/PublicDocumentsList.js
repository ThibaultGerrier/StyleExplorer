import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { browserHistory } from 'react-router';


const handleNav = (_id) =>{
  browserHistory.push(`/documents/${_id}`);
};

const DocumentsList = ({ documents }) => (
  documents.length > 0 ? <ListGroup className="DocumentsList">
    {documents.map(({ _id, title }) => (
      <ListGroupItem key={ _id } onClick={ () => handleNav(_id)}>
        { title }
      </ListGroupItem>
    ))}
  </ListGroup> :
    <Alert bsStyle="warning">No public documents yet.</Alert>
);

DocumentsList.propTypes = {
  documents: PropTypes.array,
};

export default DocumentsList;
