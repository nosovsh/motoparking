var React = require("react/addons");

require("./style.css");

var texts = {
    "is-secure_maybe_is-moto_maybe": "Мы совсем ничего не знаем об этом месте",
    "is-secure_no_is-moto_maybe": "Скорее всего здесь вообще нет охраняемой парковки",
    "is-secure_yes_is-moto_maybe": "Здесь есть охраняемая парковка, <br/ >но неизвестно можно оставить мотоцикл или нет",
    "is-secure_yes_is-moto_no": "Здесь есть охраняемая парковка, <br/ >но мотоциклы не пускают",
    "is-secure_yes_is-moto_yes": "Здесь можно оставить мотоцикл <br/ >под охраной"
};

var StatusCover = React.createClass({
    propTypes: {
        isSecure: React.PropTypes.string,
        isSoto: React.PropTypes.string
    },
    render: function () {
        var name = 'is-secure_' + this.props.isSecure +
            (this.props.isMoto ? '_is-moto_' + this.props.isMoto : "");
        var cx = React.addons.classSet;

        var coverClassName = "status-cover_" + name;
        var coverClasses = {
            'status-cover': true
        };
        coverClasses[coverClassName] = true;

        var iconClassName = "status-cover__icon_" + name;
        var iconClasses = {
            'status-cover__icon': true
        };
        iconClasses[iconClassName] = true;

        return (
            <div className={ cx(coverClasses) }>
                <div className={ cx(iconClasses) }></div>
                <div className="status-cover__text" dangerouslySetInnerHTML={{__html: texts[name]}}>
                </div>
            </div>
        );
    }
});

module.exports = StatusCover;
