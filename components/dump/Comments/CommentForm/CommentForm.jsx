var React = require("react");

var Avatar = require("../../Avatar/Avatar");
var Icon = require("../../Icon/Icon");
var ButtonRow = require("../../ButtonRow/ButtonRow");

var Router = require("react-router");
var Link = Router.Link;

require("./CommentForm.css");


var CommentForm = React.createClass({
  propTypes: {
    currentUserIsAuthorized: React.PropTypes.bool,
    currentUser: React.PropTypes.object.isRequired,
    currentParkingId: React.PropTypes.string.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      text: ""
    };
  },

  onSendComment: function() {
    if (this.state.text) {
      this.props.actions.postComment({
        parking: this.props.currentParkingId,
        text: this.state.text
      });
      this.setState({
        text: ""
      });
    }
  },

  onTextChange: function(e) {
    this.setState({
      text: e.target.value
    });
  },

  onFocus: function(e) { // eslint-disable-line no-unused-vars
    if (!this.props.currentUserIsAuthorized) {
      this.props.actions.authorizationRequired();
    }
  },

  render: function() {
    var commentWrapperClass = this.props.currentUserIsAuthorized ? "Comment__Textarea-wrapper" : "Comment__Textarea-wrapper Comment__Textarea-wrapper_margin_false";
    return (
      <div>
        <div className="Comment">
          { this.props.currentUserIsAuthorized ? (
            <div className="Comment__AvatarWrapper">
              <Link to={ "/u/" + this.props.currentUser.id}>
                <Avatar user={ this.props.currentUser } />
              </Link>
            </div>
          ) : null }
        <div className={ commentWrapperClass }>
          <textarea
            className="Comment__Textarea"
            placeholder="Что еще надо знать другим мотоциклистам об этой парковке?"
            value={ this.state.text }
            onChange={ this.onTextChange }
            onFocus={ this.onFocus }/>
          <ButtonRow callback={ this.onSendComment } color="light" height="thin">Отправить
            <Icon name="send" style={ {"fontSize": "0.8em"} }/>
          </ButtonRow>
        </div>
        </div>
      </div>
    );
  }
});

module.exports = CommentForm;
