/* eslint-disable max-len */
import React from 'react';
import { Checkbox, Button, Glyphicon } from 'react-bootstrap';

export default class Documentation extends React.Component {
  render() {
    return (
      <div>
        <h1>Documentation / FAQ</h1>

        <h3><a href="#1">1. Accounts</a></h3>
        <h4><a href="#1.1">1.1 Why do i need an account?</a></h4>
        <h4><a href="#1.2">1.2 What do i need for an account?</a></h4>
        <h3><a href="#2">2. Documents</a></h3>
        <h4><a href="#2.1">2.1 How can i upload my own document?</a></h4>
        <h4><a href="#2.2">2.2 What are all the checkboxes and input fields when uploading a document?</a></h4>
        <h4><a href="#2.3">2.3 What are paragraphs?</a></h4>
        <h4><a href="#2.4">2.4 Can i upload documents in languages other than English?</a></h4>
        <h4><a href="#2.5">2.5 How can i compare my documents?</a></h4>
        <h4><a href="#2.6">2.6 What can I do when comparing documents?</a></h4>
        <h4><a href="#2.7">2.7 What are public documents?</a></h4>
        <h4><a href="#2.8">2.8 How do I compare my documents with public documents?</a></h4>
        <h4><a href="#2.9">2.9 My document is stuck at 100%?</a></h4>

        <h2 id="1">1. Accounts</h2>

        <h3 id="1.1">1.1 Why do i need an account?</h3>
        Accounts allow you to upload your own documents, compare them with your own or make copies of public documents to compare them with those.

        <h3 id="1.2">1.2 What do i need for an account?</h3>
        Simply a unique username and a password longer then 3 characters, that&apos;s it.
        <br/><br/>

        <h2 id="2">2. Documents</h2>

        <h3 id="2.1">2.1 How can i upload my own document?</h3>
        For this you will need an account (see <a href="#accounts">FAQ. accounts</a>). When you are logged in you can head to <a href="/documents"> My documents </a>. There you will have the option to upload a single
        document or multiple documents at once. With <br/>
        <Button style={{ marginTop: '10px', marginBottom: '10px' }} bsStyle="success">New Document</Button> <br/>
        You can either upload a text file or use the textarea to add text.<br/>
        <Button style={{ marginTop: '10px', marginBottom: '10px' }} bsStyle="primary">Multiple New Document</Button><br/>
        allows you to upload multiple text documents at once.

        <h3 id="2.2">2.2 What are all the checkboxes and input fields when uploading a document?</h3>
        The checkboxes allow you to select which features should be computed for your document, you may hover on a feature to get a detailed description on what that feature is and how it is computed.
        You can also select <br/>
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Checkbox inline><b>all features</b> </Checkbox> or <Checkbox inline><b>all lexical features</b></Checkbox> to compute all features applying to that category. <br/><br/>
        </div>
        The sections with the input fields below allow you to configure n-grams and paragraphs. If you are not sure on what to input simply click the little
        <Glyphicon glyph='question-sign'
          style={{
            marginLeft: '5px', fontSize: '1.0em', color: 'grey', marginRight: '5px', cursor: 'pointer',
          }}/>
        to get more information on the settings you can configure. Or simply hover on the fields themselves to see what you can enter. You cannot do anything wrong, so no worries. <br/>

        <h3 id="2.3">2.3 What are paragraphs?</h3>
        When computing the features the documents are split into pieces or paragraphs to see how the document performs for each feature.
        This gives a better understanding of a document concerning its different phases.
        To create paragraphs take a look at the paragraph section when creating the document.

        <h3 id="2.4">2.4 Can i upload documents in languages other than English? </h3>
        Yes you can. Although the syntactical and error features will not work with languages other then english. Right now the text is getting cleaned before computing any features.
        During this cleaning process all non ascii characters will be removed from the text (with the exception of a few German and French characters like é, à, ö, î).

        <h3 id="2.5">2.5 How can i compare my documents?</h3>
        Simply go to <a href="/documents"> My documents </a> and check the documents you want to compare on the right with the
        <Glyphicon glyph="ok"
           style={{
             fontSize: '1.5em', color: 'grey', cursor: 'pointer', marginRight: '5px', marginLeft: '5px',
           }}/>
        symbol. The document will light up blue. Then you you have made your selection you can click on <br/>
        <Button style={{ marginTop: '10px', marginBottom: '10px' }} bsStyle='success'> Compare </Button> <br/>
        The website may load for a second or two and then the compare view will appear.

        <h3 id="2.6">2.6 What can I do when comparing documents?</h3>
        Lots. Click around, experiment. You can enlarge a graph by clicking the little magnifying glass on the top right of the graph.
        You can switch the type of the graph in the graphs option (the little 3 horizontal lines on the top right of the graph), download the graph as an image or find some feature-specific options.<br/>
        You can even change the color that represents a document.

        <h3 id="2.7">2.7 What are public documents?</h3>
        Public documents are documents visible to anyone. They will be listed under <a href="/public">Public documents</a>, where anyone can see the text, its features and make copies of it.
        you can make your document public simply by choosing the option:
        <Checkbox title='If you choose to make your document public, other users will be able to see your document, its features and be able to make a private copy of it'>make the document public </Checkbox>
        You can always switch a documents privacy setting when viewing the document by clicking <br/>
        <div style={{ marginTop: '10px' }}>
          <Button className="text-success">make private</Button> or&nbsp;
          <Button className="text-success">make public</Button>
        </div>

        <h3 id="2.8">2.8 How do I compare my documents with public documents?</h3>
        This can be done by selecting the public document and clicking <br/>
        <Button style={{ marginTop: '10px', marginBottom: '10px' }}>make private copy</Button><br/>
        on the top right when viewing the document.
        The next time you view <a href="/documents"> your documents</a> you will see the public document you just made a copy of listed there with an adjusted title, which includes the username of the public document.
        This document is now your own, you can edit it, delete it, make it public. <br/>
        Furthermore you can now compare it with your own documents.
        <br/><br/>

        <h3 id="2.9">2.9 My document is stuck at 100%?</h3>
        When uploading big documents, they will get stuck at 100% for a while (up to a few minutes). Should the 100% remain for a longer period, your document upload might have failed.
        You can try to split the document in parts, remove unwanted features, decrease N for n-grams.
        <br/><br/>
      </div>
    );
  }
}
