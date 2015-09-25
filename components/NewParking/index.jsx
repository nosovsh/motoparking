var React = require("react/addons");

var IsMotoQuestion = require("../IsMotoQuestion");
var PriceQuestion = require("../PriceQuestion");
var ButtonRow = require("../dump/ButtonRow/ButtonRow");
var Icon = require("../dump/Icon/Icon");

var Router = require("react-router");
var Link = Router.Link;

require("./style.css");


var NewParking = React.createClass({
  propTypes: {
    newParking: React.PropTypes.object.isRequired,
    savingNewParking: React.PropTypes.bool,
    onIsMotoQuestionCallback: React.PropTypes.func.isRequired,
    onNewParkingDone: React.PropTypes.func.isRequired,
    onPriceChange: React.PropTypes.func.isRequired
  },

  render: function() {
    var newParkingDoneIconClasses = {
      "animate-spin": this.props.savingNewParking
    };
    return (
      <div className="new-parking">
        <Link to="Default">
          <div className="close-wrapper">
            <Icon name="close" />
          </div>
        </Link>

        <div className="my-opinion__row">
          <p>
            Вы добавляете охраняемую
            <br/>
            парковку.
          </p>
          <IsMotoQuestion
            callback={ this.props.onIsMotoQuestionCallback }
            value={ this.props.newParking.isMoto }
            text="На неё пускают мотоциклы?"/>
        </div>
        { this.props.newParking.isMoto === "yes" ?
          <div className="my-opinion__row">
            <PriceQuestion
              pricePerDay={ this.props.newParking.pricePerDay }
              pricePerMonth={ this.props.newParking.pricePerMonth }
              callback={ this.props.onPriceChange } />
          </div> : null }

        <ButtonRow callback={ this.props.onNewParkingDone }>
          <Icon name="rocket" additionalClasses={ [React.addons.classSet(newParkingDoneIconClasses)] }/>
          Создать парковку
        </ButtonRow>

      </div>
    );
  }
});

module.exports = NewParking;
