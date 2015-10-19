var React = require("react");

var Icon = require("../../Icon/Icon");
var SidebarTable = require("../../SidebarTable/SidebarTable");

require("./Prices.css");


var Prices = React.createClass({
  propTypes: {
    pricePerDay: React.PropTypes.number,
    pricePerMonth: React.PropTypes.number
  },

  render: function() {
    return (
      <SidebarTable
        data={[{
          "label": "Сутки",
          "value": this.props.pricePerDay !== null ? (
            <div>
              { this.props.pricePerDay }
              <Icon name="rouble" additionalClasses={ ["Rouble"] } />
            </div>
          ) : "?"
        }, {
          "label": "Месяц",
          "value": this.props.pricePerMonth !== null ? (
            <div>
              { this.props.pricePerMonth }
              <Icon name="rouble" additionalClasses={ ["Rouble"] } />
            </div>
          ) : "?"
        }]} />
    );
  }
});

module.exports = Prices;
