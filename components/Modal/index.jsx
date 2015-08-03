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
                        <Link to="Default" style={ {color: "#FFF"} } >
                            <div className="close-wrapper">
                                <Icon name="close" />
                            </div>
                        </Link>
                        <div>
                            <img src="http://res.cloudinary.com/motoparking/image/upload/c_scale,w_1000/v1431071592/i2hne4u3ctv9ffoqi49i.jpg" className="Modal__Cover"/>
                            <div className="Modal__Text__Wrapper">
                                <h2 className="Modal__Header">Сервис поиска парковок для мотоциклов</h2>
                                <div className="Modal__Text">

                                    <p>Охраняемые парковки – практически единственный действенный способ защитить мотоцикл от угона.</p>
                                    <p>Этот сайт – попытка создать единую базу данных парковок на которые пускают мотоциклы.</p>
                                    <p>Как пользоваться:</p>
                                    <ol className="NoBullets">
                                        <li>Найди парковку в нужном районе</li>
                                        <li>Посмотри комментарии и фотки, оцени на сколько она безопасна</li>
                                        <li>Помоги мото братьям – добавь информацию о парковках, которых еще нет на сайте</li>
                                        <li>…</li>
                                        <li>Profit</li>
                                    </ol>
                                    <p>
                                        Напишите нам: <a href="mailto:info@motoparking.club">info@motoparking.club</a>
                                    </p>
                                    <p>До встречи на дороге!</p>

                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                <div className="Backdrop"></div>
            </div>
        );
    }
});

module.exports = Modal;
