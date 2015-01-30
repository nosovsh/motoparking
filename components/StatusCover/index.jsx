var React = require("react/addons");

require("./style.css");

var texts = {
    0: "Мы совсем ничего не знаем об этом месте",
    1: "Здесь нет охраняемой парковки",
    2: "Здесь есть охраняемая парковка, <br/ >но неизвестно можно остваить мотоцикл или нет",
    3: "Здесь есть охраняемая парковка, <br/ >но мотоциклы не пускают. ",
    4: "Здесь есть охраняемая парковка.<br />Можно оставить мотоцикл на ночь."
};

var StatusCover = React.createClass({
    propTypes: {
        status: React.PropTypes.number.isRequired
    },
    render: function () {
        var cx = React.addons.classSet;

        var name = 'status-cover__' + this.props.status;
        var classes = {
            'status-cover': true
        };
        classes[name] = true;

        var iconName = 'status-cover__icon__' + this.props.status;
        var iconClasses = {
            'status-cover__icon': true
        };
        iconClasses[iconName] = true;

        return (
            <div className={ cx(classes) }>
                <div className={ cx(iconClasses) }></div>
                <div className="status-cover__text" dangerouslySetInnerHTML={{__html: texts[this.props.status]}}>
                </div>
            </div>
        );
    }
});

module.exports = StatusCover;
