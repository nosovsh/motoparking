var flux = require("../../fluxy")
var React = require("react");
var Button = require("../Button");

require("./style.css");


var MyOpinionExists = React.createClass({
    propTypes: {
        parking: React.PropTypes.object.isRequired,
        onWantToChangeOpinion:  React.PropTypes.func.isRequired
    },
    render: function () {
        if (this.props.parking.myOpinion.isSecure =="yes"){
            var text = "Вы отметили, что здесь есть охраняемая парковка"
        } else if (this.props.parking.myOpinion.isSecure =="no") {
            text = "Вы отметили, что здесь нет охраняемой парковки"
        } else {
            text = "Вы отметили, что не знаете что здесь. Если узнаете – обязательно сообщите."
        }

        return (
            <div className="my-opinion__row">
                <div className="my-opinion__row__text">
                    <p>Спасибо! Кто-то теперь быстрее найдет безопасную мотопарковку. Этот мир стал чуточку лучше.</p>
                    <p>{ text }</p>
                </div>
                <Button text="Изменить своё мнение" callback={this.props.onWantToChangeOpinion.bind(this, true)}/>
            </div>
        )

    }
});

var MyOpinionNotExists = React.createClass({
    propTypes: {
        parking: React.PropTypes.object.isRequired,
        onWantToChangeOpinion:  React.PropTypes.func.isRequired,
        hasIntro: React.PropTypes.bool.isRequired
    },
    render: function () {
        var intro = (
            <p>Ты что то знаешь об этом месте? Помоги мотобратьям, поделись информацией!
                        Только совместными усилиями мы сможем изменить этот мир!</p>
        );

        return (
            <div className="my-opinion__row">
                    <div className="my-opinion__row__text">
                    { this.props.parking.myOpinion ? "" : intro }
                        <p>Здесь есть охраняемая парковка?</p>
                    </div>
                    <Button text="Да" callback={ this.isSecureCallback.bind(this, "yes") }/>
                    <Button text="Нет" callback={ this.isSecureCallback.bind(this, "no") }/>
                    <Button text="Не знаю" callback={ this.isSecureCallback.bind(this, "maybe") }/>
                </div>
        )
    },
    isSecureCallback: function (value) {
        this.props.onWantToChangeOpinion(false)
        if (value == "no" || value == "maybe") {
            flux.actions.postOpinion({
                parking: this.props.parking.id,
                isSecure: value
            });
        }
    }
});

var MyOpinion = React.createClass({
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
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.parking.id != this.props.parking.id) {
            this.onWantToChangeOpinion(false)
        }
    },
    onWantToChangeOpinion: function (value) {
        this.setState({wantToChangeOpinion: value})
    }
});

module.exports = MyOpinion;
