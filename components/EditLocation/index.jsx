var React = require("react/addons");

var ButtonRow = require("../dump/ButtonRow/ButtonRow");
var Icon = require("../dump/Icon/Icon");

require("./style.css");


var EditLocation = React.createClass({
  propTypes: {
    onEditLocationCancel: React.PropTypes.func.isRequired,
    onEditLocationDone: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="edit-location">
        <div className="close-wrapper">
          <Icon name="close" onClick={ this.props.onEditLocationCancel }/>
        </div>
        <div className="my-opinion__row">
          Передвиньте парковку, если она расположена неточно.
        </div>
        <ButtonRow callback={ this.props.onEditLocationDone }>
          <Icon name="thumbup" />
          Так лучше
        </ButtonRow>
      </div>
    );
  }
});

module.exports = EditLocation;
