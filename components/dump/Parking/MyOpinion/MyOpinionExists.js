var React = require("react");

var ButtonRow = require("../../ButtonRow/ButtonRow");
var Icon = require("../../Icon/Icon");


var texts = {
  "is-secure_maybe_is-moto_maybe": "Вы отметили, что не знаете что здесь. Если узнаете – обязательно сообщите.",
  "is-secure_no_is-moto_maybe": "Вы отметили, что здесь нет охраняемой парковки.",
  "is-secure_yes_is-moto_maybe": "Вы отметили, что здесь есть охраняемая парковка и что не знаете пускают туда мотоциклы или нет.",
  "is-secure_yes_is-moto_no": "Вы отметили, что здесь есть охраняемая парковка, но мотоциклы туда не пускают.",
  "is-secure_yes_is-moto_yes": "Вы отметили, что здесь есть охраняемая парковка на которую пускают мотоциклы."
};

var getStatusName = function(isSecure, isMoto) {
  return (isSecure ? "is-secure_" + isSecure : "") +
    (isMoto ? "_is-moto_" + isMoto : "_is-moto_maybe");
};

var MyOpinionExists = React.createClass({
  propTypes: {
    parking: React.PropTypes.object.isRequired,
    onWantToChangeOpinion: React.PropTypes.func.isRequired
  },

  render: function() {
    var text = texts[getStatusName(this.props.parking.myOpinion.isSecure, this.props.parking.myOpinion.isMoto)];

    return (
      <div>
        <div className="my-opinion__row">
          { text }
          { this.props.parking.myOpinion.pricePerDay !== null ?
            <div>Цена за сутки: { this.props.parking.myOpinion.pricePerDay } рублей.</div> : null }
          { this.props.parking.myOpinion.pricePerMonth !== null ?
            <div>Цена за месяц: { this.props.parking.myOpinion.pricePerMonth } рублей.</div> : null }
        </div>
        <ButtonRow callback={ this.props.onWantToChangeOpinion.bind(null, true) }>
          <Icon name="edit"/>
          { "Что то поменялось?" }
        </ButtonRow>
      </div>
    );
  }
});

module.exports = MyOpinionExists;
