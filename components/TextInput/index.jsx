var React = require("react/addons");

require("./style.css");


var TextInput = React.createClass({
  render: function() {
    return (
      <input type="text" className="TextInput" placeholder="Не знаю" { ...this.props }/>
    );
  }
});

module.exports = TextInput;
