var React = require("react/addons");

var Router = require("react-router");
var Link = Router.Link;

var YesNoMaybeQuestion = require("../YesNoMaybeQuestion/YesNoMaybeQuestion");
var PriceQuestion = require("../PriceQuestion/PriceQuestion");
var ButtonRow = require("../ButtonRow/ButtonRow");
var Icon = require("../Icon/Icon");
var Row = require("../Row/Row");

require("./NewParking.css");


var NewParking = React.createClass({
  propTypes: {
    newParking: React.PropTypes.object.isRequired,
    savingNewParking: React.PropTypes.bool,
    onIsMotoQuestionCallback: React.PropTypes.func.isRequired,
    onNewParkingDone: React.PropTypes.func.isRequired,
    onPriceChange: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="NewParking">
        <Link to="/">
          <div className="close-wrapper">
            <Icon name="close" />
          </div>
        </Link>

        <Row>
          <p>
            Вы добавляете охраняемую
            <br/>
            парковку.
          </p>
          <YesNoMaybeQuestion
            text="На неё пускают мотоциклы?"
            callback={ this.props.onIsMotoQuestionCallback }
            value={ this.props.newParking.isMoto }/>
        </Row>
        { this.props.newParking.isMoto === "yes" ?
          <Row>
            <PriceQuestion
              pricePerDay={ this.props.newParking.pricePerDay }
              pricePerMonth={ this.props.newParking.pricePerMonth }
              callback={ this.props.onPriceChange } />
          </Row> : null }

        <ButtonRow callback={ this.props.onNewParkingDone }>
          <Icon name="rocket" animation={ this.props.savingNewParking ? "spin" : null }/>
          Создать парковку
        </ButtonRow>

      </div>
    );
  }
});

module.exports = NewParking;
