var React = require("react");
var _ = require("lodash");

var Button = require("../Button/Button");


var YesNoMaybeQuestion = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    value: React.PropTypes.string,
    callback: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <div>
        <p>{ this.props.text }</p>
        <Button text="Да" callback={ _.partial(this.props.callback, "yes") } selected={ this.props.value === "yes" }/>
        <Button text="Нет" callback={ _.partial(this.props.callback, "no") } selected={ this.props.value === "no" }/>
        <Button text="Не знаю" callback={ _.partial(this.props.callback, "maybe") } selected={ this.props.value === "maybe" }/>
      </div>
    );
  }
});

module.exports = YesNoMaybeQuestion;
