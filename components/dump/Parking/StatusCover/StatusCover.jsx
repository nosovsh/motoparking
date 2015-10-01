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

var StatusCover = React.createClass({
  propTypes: {
    isSecure: React.PropTypes.string,
    isMoto: React.PropTypes.string
  },

  render: function() {
    var name = "is-secure_" + this.props.isSecure +
      (this.props.isMoto ? "_is-moto_" + this.props.isMoto : "");

    // TODO: remove hack `this.props.isSecure !== undefined`
    var textRows = this.props.isSecure !== undefined ? texts[name].split("\n").map(function(str, i) {
      return (
        <span key={ i }>{ str }<br /></span>
      );
    }) : [];

    return (
      <div className={ classNames("status-cover", "status-cover_" + name) }>
        <div className={ classNames("status-cover__icon", "status-cover__icon_" + name) }></div>
        <div className="status-cover__text">
          { textRows }
        </div>
      </div>
    );
  }
});

module.exports = StatusCover;
