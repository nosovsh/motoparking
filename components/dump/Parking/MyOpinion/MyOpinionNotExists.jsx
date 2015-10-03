var React = require("react");
var _ = require("lodash");

var YesNoMaybeQuestion = require("../../YesNoMaybeQuestion/YesNoMaybeQuestion");
var ButtonRow = require("../../ButtonRow/ButtonRow");
var Icon = require("../../Icon/Icon");
var PriceQuestion = require("../../PriceQuestion/PriceQuestion");
var Row = require("../../Row/Row");


var MyOpinionNotExists = React.createClass({
  propTypes: {
    parking: React.PropTypes.object.isRequired,
    onWantToChangeOpinion: React.PropTypes.func.isRequired,
    currentUserIsAuthorized: React.PropTypes.bool,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      tmpOpinion: _.extend({parking: this.props.parking.id}, this.props.parking.myOpinion)
    };
  },

  onIsSecureAnswer: function(value) {
    if (!this.props.currentUserIsAuthorized) {
      this.props.actions.authorizationRequired();
      return;
    }
    var tmpOpinion = _.extend({}, this.state.tmpOpinion, {isSecure: value});
    if (value === "no" || value === "maybe") {
      tmpOpinion.isMoto = "maybe";
      tmpOpinion.pricePerDay = null;
      tmpOpinion.pricePerMonth = null;
      this.props.actions.postOpinion(tmpOpinion);
      this.props.onWantToChangeOpinion(false);
    } else {
      tmpOpinion.isMoto = null;
    }
    this.setState({
      tmpOpinion: tmpOpinion
    });
  },

  onIsMotoAnswer: function(value) {
    var tmpOpinion = _.extend({}, this.state.tmpOpinion, {isMoto: value});
    if (value === "no" || value === "maybe") {
      tmpOpinion.pricePerDay = null;
      tmpOpinion.pricePerMonth = null;
      this.props.actions.postOpinion(tmpOpinion);
      this.props.onWantToChangeOpinion(false);
    }
    this.setState({
      tmpOpinion: tmpOpinion
    });
  },

  onPriceChange: function(dictWithPrices) {
    this.setState({
      tmpOpinion: _.extend({}, this.state.tmpOpinion, dictWithPrices)
    });
  },

  onSave: function() {
    this.props.actions.postOpinion(this.state.tmpOpinion);
    this.props.onWantToChangeOpinion(false);
  },

  render: function() {
    return (
      <div>
        <Row>
          <YesNoMaybeQuestion
            text="Здесь есть охраняемая парковка?"
            value={ this.state.tmpOpinion.isSecure }
            callback={ this.onIsSecureAnswer }/>
        </Row>

        { this.state.tmpOpinion.isSecure === "yes" ? (
          <Row>
            <YesNoMaybeQuestion
              text="Сюда пускают мотоциклы?"
              value={ this.state.tmpOpinion.isMoto }
              callback={ this.onIsMotoAnswer }/>
          </Row>
        ) : null }

        { this.state.tmpOpinion.isMoto === "yes" ? (
         <Row>
           <PriceQuestion
             pricePerDay={ this.state.tmpOpinion.pricePerDay }
             pricePerMonth={ this.state.tmpOpinion.pricePerMonth }
             callback={ this.onPriceChange } />
         </Row>
        ) : null }

        { this.state.tmpOpinion.isMoto === "yes" ? (
         <ButtonRow callback={ this.onSave }>
           <Icon name="rocket"/>
           Сохранить
         </ButtonRow>
        ) : null }

      </div>
    );
  }
});

module.exports = MyOpinionNotExists;
