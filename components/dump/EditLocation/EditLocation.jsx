var React = require("react");

var ButtonRow = require("../ButtonRow/ButtonRow");
var Icon = require("../Icon/Icon");
var Row = require("../Row/Row");

require("./EditLocation.css");


var EditLocation = React.createClass({
  propTypes: {
    onEditLocationCancel: React.PropTypes.func.isRequired,
    onEditLocationDone: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="EditLocation">
        <div className="close-wrapper">
          <Icon name="close" onClick={ this.props.onEditLocationCancel }/>
        </div>
        <Row>
          Передвиньте парковку, если она расположена неточно.
        </Row>
        <ButtonRow callback={ this.props.onEditLocationDone }>
          <Icon name="thumbup" />
          Так лучше
        </ButtonRow>
      </div>
    );
  }
});

module.exports = EditLocation;
