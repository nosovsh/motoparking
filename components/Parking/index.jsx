var React = require("react/addons"),
    Fluxxor = require("fluxxor");

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
    Slider = require("../Slider"),
    AvatarList = require("../dump/AvatarList/AvatarList");


var Parking = React.createClass({

    mixins: [Router.State, FluxMixin, StoreWatchMixin("ParkingStore", "OpinionStore", "CommentStore", "CurrentUserStore")],

    render: function () {
        if (this.state.editingLocation) {
            return (
                <div className="edit-location">
                    <EditLocation />
                </div>
            )
        } else {
            return (
                <div className="sidebar__wrapper" >
                    <div className="sidebar__content" ref="parking__content">
                        <div className="sidebar__content__inner" ref="parking__content__inner">
                            { this.state.currentUser.isSuper ?
                            <a href="#" style={ {color: "#FFF"} } onClick={ this.deleteParking }>
                                <div className="close-wrapper" style={{right: "inherit",left: 6}}>
                                    <Icon name="delete" />
                                </div>
                            </a> : null }

                            <Link to="Default" style={ {color: "#FFF"} }>
                                <div className="close-wrapper">
                                    <Icon name="close" />
                                </div>
                            </Link>

                            <StatusCover isSecure={ this.state.currentParking.isSecure }  isMoto={ this.state.currentParking.isMoto }/>

                        { this.state.currentParking.isFullParkingLoaded ? (
                            <div>
                                <AvatarList users={ this.state.currentParking.users } />

                                { this.state.currentParking.isMoto == "yes" ?
                                    <div className="Prices">
                                        <div className="Prices__Price">
                                            <div className="Prices__Price__Label">
                                                Сутки
                                            </div>
                                            <div className="Prices__Price__Value">
                                                { this.state.currentParking.pricePerDay ?
                                                    <div>
                                                        { this.state.currentParking.pricePerDay }
                                                        <Icon name="rouble" additionalClasses={ ["Rouble"] } />
                                                    </div> : "?" }

                                            </div>
                                        </div>

                                        <div className="Prices__Price">

                                            <div className="Prices__Price__Label">
                                                Месяц
                                            </div>
                                            <div className="Prices__Price__Value">
                                                { this.state.currentParking.pricePerMonth ?
                                                    <div>
                                                        { this.state.currentParking.pricePerMonth }
                                                        <Icon name="rouble" additionalClasses={ ["Rouble"] } />
                                                    </div> : "?" }
                                            </div>
                                        </div>

                                    </div> : null }

                                <Slider images={ this.state.currentParking.images } />

                                <div className="InfoRow">
                                    <div className="Address">{ this.state.currentParking.address }&nbsp;</div>
                                    { this.state.currentUser && this.state.currentUser.id == this.state.currentParking.user ?
                                    <Icon name="edit" additionalClasses={ ["edit-location-button"] } onClick={ this.editLocation }/> :
                                        null }
                                </div>

                                <MyOpinion parking={ this.state.currentParking }/>

                                <Comments comments={ this.state.comments } />
                            </div>) :
                            <div className="loading">Loading...</div> }
                        </div>
                    </div>
                </div>
            )
        }
    },

    componentDidMount: function () {
        this.getFlux().actions.loadCurrentParking(this.getParams().id);
        //this.getFlux().actions.loadOpinions(this.getParams().id);

        var parkingContent = this.refs.parking__content.getDOMNode();
        var parkingContentInner = this.refs.parking__content__inner.getDOMNode();
        $(parkingContent).scroll(function () {
            if ($(parkingContent).scrollTop() + $(parkingContent).height() == $(parkingContentInner).height()) {
                this.getFlux().actions.parkingScrolled("bottom")
            }
            if ($(parkingContent).scrollTop() == 0) {
                this.getFlux().actions.parkingScrolled("top")
            }
        }.bind(this))
    },

    componentWillReceiveProps: function (nextProps) {
        this.getFlux().actions.loadCurrentParking(this.getParams().id);
        //this.getFlux().actions.loadOpinions(this.getParams().id);
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var opinionStore = this.getFlux().store("OpinionStore");
        var commentStore = this.getFlux().store("CommentStore");
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            loading: store.loading,
            error: store.error,
            currentParking: store.getCurrentParking(),
            currentParkingId: store.currentParkingId,
            currentParkingOpinions: opinionStore.opinionsByParking[store.currentParkingId] ? opinionStore.opinionsByParking[store.currentParkingId] : [],
            editingLocation: store.editingLocation,
            comments: commentStore.getComments(store.currentParkingId),
            loadingAddress: store.loadingAddress,
            loadingAddressError: store.loadingAddressError,
            currentUser: currentUserStore.currentUser
        };
    },

    editLocation: function () {
        this.getFlux().actions.editLocation();
    },

    deleteParking: function () {
        this.getFlux().actions.deleteParking(this.state.currentParking.id);
    }

});

module.exports = Parking;
