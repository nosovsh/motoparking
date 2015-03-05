var React = require("react/addons");

require("./style.css");

var TextInput = require("../TextInput"),
    Icon = require("../Icon");

var PriceQuestion = React.createClass({

    propTypes: {
        callback: React.PropTypes.func.isRequired,
        pricePerDay: React.PropTypes.number,
        pricePerMonth: React.PropTypes.number
    },
    render: function () {
        return (
            <div className="PricesEditing">
                <div className="PricesEditing__Price">
                    <div className="PricesEditing__Price__Label">
                        День
                    </div>
                    <div className="PricesEditing__Price__Value">
                        <TextInput onChange={ this.onPricePerDayChange } value={ this.props.pricePerDay } />

                        <Icon name="rouble"  additionalClasses={ ["Rouble"] } />
                    </div>
                </div>

                <div className="PricesEditing__Price">

                    <div className="PricesEditing__Price__Label">
                        Месяц
                    </div>
                    <div className="PricesEditing__Price__Value">
                        <TextInput onChange={ this.onPricePerMonthChange } value={ this.props.pricePerMonth } />

                        <Icon name="rouble"  additionalClasses={ ["Rouble"] } />
                    </div>
                </div>

            </div>

        )
    },

    onPricePerDayChange: function (e) {
        var price = parseInt(e.target.value);
        price = isNaN(price) ? "" : price;
        this.props.callback({pricePerDay: price, pricePerMonth: this.props.pricePerMonth})
    },

    onPricePerMonthChange: function (e) {
        var price = parseInt(e.target.value);
        price = isNaN(price) ? "" : price;
        this.props.callback({pricePerDay: this.props.pricePerDay, pricePerMonth: price})
    }
});

module.exports = PriceQuestion;
