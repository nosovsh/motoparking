var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Router = require('react-router'),
    Link = Router.Link;

var Icon = require("../Icon");


var Modal = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return (

            <div className="Modal" >
                <div className="Modal__Content">
                    <div className="Modal__Content__Inner">
                        <Link to="Default">
                            <div className="close-wrapper">
                                <Icon name="close" />
                            </div>
                        </Link>
                        <div>
                            <h3>О проекте</h3>
                            <p>Сервис для обмена информацией об охраняемых парковках для мотоциклов.</p>
                            <p>
                                <a href="mailto:info@motoparking.club">info@motoparking.club</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="Backdrop"></div>
            </div>
        );
    }
});

module.exports = Modal;
