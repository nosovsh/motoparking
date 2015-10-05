var React = require("react/addons");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var Avatar = require("../Avatar/Avatar");

require("./User.css");


var User = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  render: function() {
    if (!this.props.user) {
      return <div>loading</div>;
    }
    return (
      <div className="User">
        <div className="User__Cover">
          <Avatar user={ this.props.user } />
          <div className="User__Name">
            { _.capitalize(this.props.user.firstName) } { _.capitalize(this.props.user.lastName) }
          </div>
        </div>
        <Link to="/p/554a2fcb7c480d000ba31f59" style={ {color: "#000"} }>
          asdf
        </Link>
      </div>
    );
  }
});

module.exports = User;
