var React = require("react/addons");

var Icon = require("../../Icon/Icon");

require("./Prices.css");


var Prices = React.createClass({
  propTypes: {
    pricePerDay: React.PropTypes.number,
    pricePerMonth: React.PropTypes.number
  },

  render: function() {
    return (
      <div className="Prices">
        <div className="Prices__Price">
          <div className="Prices__Price__Label">
            Сутки
          </div>
          <div className="Prices__Price__Value">
            { this.props.pricePerDay !== null ?
              <div>
                { this.props.pricePerDay }
                <Icon name="rouble" additionalClasses={ ["Rouble"] } />
              </div> : "?" }
          </div>
        </div>

        <div className="Prices__Price">
          <div className="Prices__Price__Label">
            Месяц
          </div>
          <div className="Prices__Price__Value">
            { this.props.pricePerMonth !== null ?
              <div>
                { this.props.pricePerMonth }
                <Icon name="rouble" additionalClasses={ ["Rouble"] } />
              </div> : "?" }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Prices;
