import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';

class DocumentsList extends React.Component {
  render() {
    const { documents, history } = this.props;
    return (
      documents.length > 0 ? <ListGroup className="DocumentsList">
          {documents.map(({ _id, title }) => (
            <ListGroupItem key={_id} onClick={() => {
              history.push(`/documents/${_id}`);
            }}>
              {title}
            </ListGroupItem>
          ))}
        </ListGroup> :
        <Alert bsStyle="warning">No public documents yet.</Alert>
    );
  }
}

DocumentsList.propTypes = {
  documents: PropTypes.array,
  history: PropTypes.object,
};

export default DocumentsList;
