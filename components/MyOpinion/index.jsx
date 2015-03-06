var React = require("react"),
    Fluxxor = require("fluxxor"),
    _ = require("lodash");

require("./style.css");

var Button = require("../Button"),
    IsMotoQuestion = require("../IsMotoQuestion"),
    IsSecureQuestion = require("../IsSecureQuestion"),
    ButtonRow = require("../ButtonRow"),
    Icon = require("../Icon"),
    PriceQuestion = require("../PriceQuestion");


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var texts = {
    "is-secure_maybe_is-moto_maybe": "Вы отметили, что не знаете что здесь. Если узнаете – обязательно сообщите.",
    "is-secure_no_is-moto_maybe": "Вы отметили, что здесь нет охраняемой парковки.",
    "is-secure_yes_is-moto_maybe": "Вы отметили, что здесь есть охраняемая парковка и что не знаете пускают туда мотоциклы или нет.",
    "is-secure_yes_is-moto_no": "Вы отметили, что здесь есть охраняемая парковка, но мотоциклы туда не пускают.",
    "is-secure_yes_is-moto_yes": "Вы отметили, что здесь есть охраняемая парковка на которую пускают мотоциклы."
};


var getStatusName = function (isSecure, isMoto) {
    return (isSecure ? 'is-secure_' + isSecure : "") +
        (isMoto ? '_is-moto_' + isMoto : "_is-moto_maybe");
};

var MyOpinionExists = React.createClass({
    propTypes: {
        parking: React.PropTypes.object.isRequired,
        onWantToChangeOpinion: React.PropTypes.func.isRequired
    },
    render: function () {
        var text = texts[getStatusName(this.props.parking.myOpinion.isSecure, this.props.parking.myOpinion.isMoto)];

        return (
            <div>
                <div className="my-opinion__row">
                    { text }
                    { this.props.parking.myOpinion.pricePerDay ?
                        <div>Цена за сутки: { this.props.parking.myOpinion.pricePerDay } рублей.</div> : null }
                    { this.props.parking.myOpinion.pricePerMonth ?
                        <div>Цена за месяц: { this.props.parking.myOpinion.pricePerMonth } рублей.</div> : null }
                </div>
                <ButtonRow callback={ this.props.onWantToChangeOpinion.bind(null, true) }>
                    <Icon name="edit"/>
                         { "Что то поменялось?" }
                </ButtonRow>
            </div>
        )

    }
});

var MyOpinionNotExists = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        parking: React.PropTypes.object.isRequired,
        onWantToChangeOpinion: React.PropTypes.func.isRequired,
        hasIntro: React.PropTypes.bool.isRequired
    },
    getInitialState: function () {
        return {
            tmpOpinion: _.extend({parking: this.props.parking.id}, this.props.parking.myOpinion)
        }
    },

    render: function () {
        return (
            <div>
                <div className="my-opinion__row">
                    <IsSecureQuestion value={ this.state.tmpOpinion.isSecure } callback={ this.isSecureCallback }/>
                </div>
                { this.state.tmpOpinion.isSecure == "yes" ?
                    <div className="my-opinion__row">
                        <IsMotoQuestion value={ this.state.tmpOpinion.isMoto } callback={ this.isMotoCallback }/>
                    </div> : null
                    }
                 { this.state.tmpOpinion.isMoto == "yes" ?
                     <div className="my-opinion__row">

                         <PriceQuestion
                             pricePerDay={ this.state.tmpOpinion.pricePerDay }
                             pricePerMonth={ this.state.tmpOpinion.pricePerMonth }
                             callback={ this.onPriceChange } />
                     </div> : null }

                 { this.state.tmpOpinion.isMoto == "yes" ?
                     <ButtonRow callback={ this.onSave }>
                         <Icon name="rocket"/>
                         Сохранить
                     </ButtonRow> : null }

            </div>

        )

        var intro = (
            <p>Ты что то знаешь об этом месте&#63; Помоги мотобратьям, поделись информацией!
                Только совместными усилиями мы сможем изменить этот мир!</p>
        );
    },
    isSecureCallback: function (value) {
        var tmpOpinion = _.extend({}, this.state.tmpOpinion, {isSecure: value});
        if (value == "no" || value == "maybe") {
            tmpOpinion.isMoto = "maybe";
            tmpOpinion.pricePerDay = null;
            tmpOpinion.pricePerMonth = null;
            this.getFlux().actions.postOpinion(tmpOpinion);
            this.props.onWantToChangeOpinion(false);
        } else {
            tmpOpinion.isMoto = null;
        }
        this.setState({
            tmpOpinion: tmpOpinion
        });
    },
    isMotoCallback: function (value) {
        var tmpOpinion = _.extend({}, this.state.tmpOpinion, {isMoto: value});
        if (value == "no" || value == "maybe") {
            tmpOpinion.pricePerDay = null;
            tmpOpinion.pricePerMonth = null;
            this.getFlux().actions.postOpinion(tmpOpinion);
            this.props.onWantToChangeOpinion(false);
        }
        this.setState({
            tmpOpinion: tmpOpinion
        });
    },
    onPriceChange: function (dictWithPrices) {
        this.setState({
            tmpOpinion: _.extend({}, this.state.tmpOpinion, dictWithPrices)
        });
    },
    onSave: function () {
        this.getFlux().actions.postOpinion(this.state.tmpOpinion);
        this.props.onWantToChangeOpinion(false);
    }
});

var MyOpinion = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        parking: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            wantToChangeOpinion: false
        }
    },
    render: function () {
        return (
            <div className="my-opinion">
                { this.props.parking.myOpinion && !this.state.wantToChangeOpinion ?
                    <MyOpinionExists parking={ this.props.parking } onWantToChangeOpinion={ this.onWantToChangeOpinion } /> :
                    <MyOpinionNotExists
                        parking={ this.props.parking }
                        onWantToChangeOpinion={ this.onWantToChangeOpinion }
                    />}
            </div>
        )
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.parking.id != this.props.parking.id) {
            this.onWantToChangeOpinion(false)
        }
    },
    onWantToChangeOpinion: function (value) {
        this.setState({wantToChangeOpinion: value})
    }
});

module.exports = MyOpinion;
