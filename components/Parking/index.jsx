var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup;

require("./style.css");

var Router = require('react-router'),
    Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var StatusCover = require("../StatusCover"),
    MyOpinion = require("../MyOpinion"),
    EditLocation = require("../EditLocation"),
    Icon = require("../Icon"),
    Photo = require("../Photo"),
    Comments = require("../Comments"),
    AvatarList = require("../AvatarList");


var Parking = React.createClass({
    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore")],

    render: function () {
        var fakeComments = [
            {
                user: {
                    _id: "u2",
                    name: "Мирослав Шашек",
                    pictureUrl: "/static/test/picture-nosov.jpg"
                },
                _id: "2",
                text: "Ворота закрываются на ночь и охранники как ни странно не пьяные (обычно)"
            },
            {
                user: {
                    _id: "u3",
                    name: "Джонни",
                    pictureUrl: "/static/test/picture-jonny.png"
                },
                _id: "3",
                text: "Всегда ставлю здесь свою Веспу, когда к бабушке заезжаю"
            },
            {
                user: {
                    _id: "u1",
                    name: "Гоша Шиков",
                    pictureUrl: "/static/test/picture-gosha.png"
                },
                _id: "1",
                text: "Как оказалось ночью сюда попасть нельзя :( Пришлось искать другое место"
            }
        ];
        var fakeUsers = [
            {
                _id: "u2",
                name: "Мирослав Шашек",
                pictureUrl: "/static/test/picture-miroslav1.png"
            },
            {
                _id: "u5",
                name: "Александр Носов",
                pictureUrl: "/static/test/picture-nosov.jpg"
            },
            {
                _id: "u3",
                name: "Джонни",
                pictureUrl: "/static/test/picture-jonny.png"
            },
            {
                _id: "u1",
                name: "Гоша Шиков",
                pictureUrl: "/static/test/picture-gosha.png"
            }
        ];
        if (this.state.editingLocation) {
            return (
                <div className="edit-location">
                    <EditLocation />
                </div>
            )
        } else {
            return (
                <div className="sidebar__wrapper">
                    <div className="sidebar__content">
                        <Link to="Default" style={ {color: "#FFF" } }>
                            <div className="close-wrapper">
                                <Icon name="close" />
                            </div>
                        </Link>

                        <StatusCover isSecure={ this.state.currentParking.isSecure }  isMoto={ this.state.currentParking.isMoto }/>

                        { this.state.currentParking.isFullParkingLoaded ? (
                            <div>
                                <AvatarList users={ fakeUsers } />

                                { this.state.currentParking.isMoto == "yes" ?
                                    <div className="Prices">
                                        <div className="Prices__Price">
                                            <div className="Prices__Price__Label">
                                                День
                                            </div>
                                            <div className="Prices__Price__Value">
                                                { this.state.currentParking.pricePerDay ?
                                                    <div>
                                                        { this.state.currentParking.pricePerDay }<Icon name="rouble" additionalClasses={ ["Rouble"] } />
                                                    </div> : "–" }

                                            </div>
                                        </div>

                                        <div className="Prices__Price">

                                            <div className="Prices__Price__Label">
                                                Месяц
                                            </div>
                                            <div className="Prices__Price__Value">
                                                { this.state.currentParking.pricePerMonth ?
                                                    <div>
                                                        { this.state.currentParking.pricePerMonth }<Icon name="rouble" additionalClasses={ ["Rouble"] } />
                                                    </div> : "–" }
                                            </div>
                                        </div>

                                    </div> : null }

                                <Photo url="/static/test/garaj.jpg" />
                                <div className="InfoRow">
                                    ул. Ленина д. 6, владение 17
                                    <Icon name="edit" style={ {
                                        float: "right",
                                        cursor: "pointer"
                                    } } onClick={ this.editLocation }/>
                                </div>

                                <MyOpinion parking={ this.state.currentParking }/>

                                <Comments comments={ fakeComments } />
                            </div>) :
                            <div className="loading">Loading...</div> }
                    </div>
                </div>
            )
        }
    },

    componentDidMount: function () {
        this.getFlux().actions.loadCurrentParking(this.getParams().id);
        //this.getFlux().actions.loadOpinions(this.getParams().id);
    },

    componentWillReceiveProps: function (nextProps) {
        this.getFlux().actions.loadCurrentParking(this.getParams().id);
        //this.getFlux().actions.loadOpinions(this.getParams().id);
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var opinionStore = this.getFlux().store("OpinionStore");

        return {
            loading: store.loading,
            error: store.error,
            currentParking: store.getCurrentParking(),
            currentParkingId: store.currentParkingId,
            currentParkingOpinions: opinionStore.opinionsByParking[this.getParams().id] ? opinionStore.opinionsByParking[this.getParams().id] : [],
            editingLocation: store.editingLocation
        };
    },
    editLocation: function () {
        this.getFlux().actions.editLocation();
    }

});

module.exports = Parking;
