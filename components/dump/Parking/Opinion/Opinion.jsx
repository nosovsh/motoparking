var React = require("react/addons");
var ReactRouter = require("react-router");
var History = ReactRouter.History;
var _ = require("lodash");
var moment = require("moment");

var Icon = require("../../Icon/Icon");

require("./Opinion.css");


var yesNoMaybeToString = {
  yes: "Да",
  no: "Нет",
  maybe: "Не знаю"
};


var Opinion = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    opinion: React.PropTypes.object,
    parking: React.PropTypes.object
  },

  mixins: [History],

  getDefaultProps: function() {
    return {
      user: {},
      opinion: {},
      parking: {}
    };
  },

  goToParking: function() {
    this.history.pushState(null, "/p/" + this.props.parking.id);
  },

  render: function() {
    return (
      <div className="Opinion" onClick={ this.goToParking }>
        <div className="Opinion__Data">
          <div className="Opinion__Address">{ _.capitalize(this.props.parking.address) }</div>
          <div className="Opinion__Date">{ moment(this.props.opinion.updated).fromNow() }</div>
          <div className="Opinion__questions">
            Парковка? { yesNoMaybeToString[this.props.opinion.isSecure] }.
            Мото? { yesNoMaybeToString[this.props.opinion.isMoto] }.
            { this.props.opinion.pricePerDay || this.props.opinion.pricePerMonth ? (
              <div>
                { this.props.opinion.pricePerDay ? (
                  <span>Сутки: { this.props.opinion.pricePerDay } <Icon name="rouble" additionalClasses={["Opinion__Ruble"]}/> </span>
                ) : null }
                { this.props.opinion.pricePerMonth ? (
                  <span>Месяц: { this.props.opinion.pricePerMonth } <Icon name="rouble" additionalClasses={["Opinion__Ruble"]}/></span>
                ) : null }
              </div>
            ) : null }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Opinion;
