var React = require("react/addons");
var classNames = require("classnames");

require("./StatusCover.css");

var texts = {
  "is-secure_maybe_is-moto_maybe": "Мнения об этом месте расходятся. \nМы не знаем что тут",
  "is-secure_no_is-moto_maybe": "Скорее всего здесь нет охраняемой парковки",
  "is-secure_yes_is-moto_maybe": "Здесь есть охраняемая парковка, \nно неизвестно можно ли оставить мотоцикл",
  "is-secure_yes_is-moto_no": "Здесь есть охраняемая парковка, \nно мотоциклы не пускают",
  "is-secure_yes_is-moto_yes": "Здесь можно оставить мотоцикл \nпод охраной"
};

var statusImages = {
  "is-secure_maybe_is-moto_maybe": require("./images/is-secure_maybe_is-moto_maybe.svg"),
  "is-secure_no_is-moto_maybe": require("./images/is-secure_no_is-moto_maybe.svg"),
  "is-secure_yes_is-moto_maybe": require("./images/is-secure_yes_is-moto_maybe.svg"),
  "is-secure_yes_is-moto_no": require("./images/is-secure_yes_is-moto_no.svg"),
  "is-secure_yes_is-moto_yes": require("./images/is-secure_yes_is-moto_yes.svg")
};

var getStatusName = function(isSecure, isMoto) {
  return "is-secure_" + isSecure + "_is-moto_" + isMoto;
};

var getStatusImage = function(isSecure, isMoto) {
  return statusImages[getStatusName(isSecure, isMoto)];
};

var StatusCover = React.createClass({
  propTypes: {
    isSecure: React.PropTypes.string,
    isMoto: React.PropTypes.string
  },

  render: function() {
    var name = getStatusName(this.props.isSecure, this.props.isMoto);

    var textRows = texts[name] ? texts[name].split("\n").map(function(str, i) {
      return (
        <span key={ i }>{ str }<br /></span>
      );
    }) : [];

    return (
      <div className={ classNames("StatusCover", "StatusCover_" + name) }>
        <div
          className={ classNames("StatusCover__icon", "StatusCover__icon_" + name) }
          style={ {backgroundImage: "url(" + getStatusImage(this.props.isSecure, this.props.isMoto) + ")" } }></div>
        <div className="StatusCover__text">
          { textRows }
        </div>
      </div>
    );
  }
});

module.exports = {
  StatusCover: StatusCover,
  getStatusName: getStatusName,
  getStatusImage: getStatusImage
};
