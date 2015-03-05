var React = require("react"),
    Fluxxor = require("fluxxor"),
    _ = require("lodash");

require("./style.css");

var Button = require("../Button"),
    IsMotoQuestion = require("../IsMotoQuestion"),
    IsSecureQuestion = require("../IsSecureQuestion");


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;



var MyOpinionExists = React.createClass({
    propTypes: {
        parking: React.PropTypes.object.isRequired,
        onWantToChangeOpinion: React.PropTypes.func.isRequired
    },
    render: function () {
        if (this.props.parking.myOpinion.isSecure == "yes") {
            var text = "Вы отметили, что здесь есть охраняемая парковка"
        } else if (this.props.parking.myOpinion.isSecure == "no") {
            text = "Вы отметили, что здесь нет охраняемой парковки"
        } else {
            text = "Вы отметили, что не знаете что здесь. Если узнаете – обязательно сообщите."
        }
        // <p>Спасибо! Кто-то теперь быстрее найдет безопасную мотопарковку. Этот мир стал чуточку лучше.</p>
        return (
            <div>
                <div className="my-opinion__row">
                    <div className="my-opinion__row__text">

                        <p>{ text }</p>
                    </div>
                    <Button text="Изменить своё мнение" callback={this.props.onWantToChangeOpinion.bind(null, true)}/>
                </div>
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
        var intro = (
            <p>Ты что то знаешь об этом месте&#63; Помоги мотобратьям, поделись информацией!
                Только совместными усилиями мы сможем изменить этот мир!</p>
        );

        return (
            <div>
                <div className="my-opinion__row">
                    <IsSecureQuestion value={ this.state.tmpOpinion.isSecure } callback={ this.isSecureCallback }/>
                </div>
                { this.state.tmpOpinion.isSecure == "yes" ?
                    <div className="my-opinion__row">
                        <IsMotoQuestion value={ this.state.tmpOpinion.isMoto } callback={ this.isMotoCallback }/>
                    </div> : <div />
                    }
            </div>

        )
    },
    isSecureCallback: function (value) {
        var tmpOpinion = _.extend({}, this.state.tmpOpinion, {isSecure: value});
        console.log("111");
        if (value == "no" || value == "maybe") {
            tmpOpinion.isMoto = null;
            this.getFlux().actions.postOpinion(tmpOpinion);
            this.props.onWantToChangeOpinion(false);
        }
        this.setState({
            tmpOpinion: tmpOpinion
        });
    },
    isMotoCallback: function (value) {
        var tmpOpinion = _.extend({}, this.state.tmpOpinion, {isMoto: value});
        this.setState({
            tmpOpinion: tmpOpinion
        });
        this.getFlux().actions.postOpinion(tmpOpinion);
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
