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


                                    <p>Все мы хотим жить в мире, где мотоциклы не угоняют, алкоголь бесплатен, женщины доступны, мужчины верны, а розовые пони играют ну лугу в прятки.</p>
                                    <p>Как решить проблемы связанные с пони, алкоголем и всем остальным мы пока думаем, а вот как сделать так, что бы мотоциклы угоняли чуточку реже мы кажется знаем.</p>
                                    <p>На этом сайте мы пытаемся собрать всю информацию об авостоянках, где за нашими мотоциклами может кто-то присмотреть.  Что бы в следующий раз, когда ты приедешь в незнакомое место, тебе не пришлось нарезать круги по району в поисках парковок, куда пускают мотоциклы, что бы тебе не пришлось заранее шерстить мотофорумы в поисках хелп листа.
                                        И самое главное, что бы не пришлось оставлять своего драгоценного коня у подъезда на растерзание гопникам и прочей нечести.</p>
                                    <p>Конечно никакая даже самая крутая охрана не сможет гарантировать стопроцентной сохранности твоего байка. Но преступники идут по пути наименьшего сопротивления. Им всегда проще утащить байк с улицы, чем связываться с охраной парковки.</p>
                                    <p>Мы – это не только команда проекта, мы – это все мотоциклисты, кому не безразличен этот мир. Поэтому если тебе есть что сказать – смело добавляй парковку о которой что-то знаешь, расскажи адекватная ли там охрана, может добавь пару фоток, напиши сколько там возьмут за ночь.</p>
                                    <p>Этот сервис – маленький, но важный шаг в сторону идеального мира.</p>
                                </div>
                            </div>



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
