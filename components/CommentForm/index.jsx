var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Avatar = require("../dump/Avatar/Avatar"),
    Icon = require("../dump/Icon/Icon"),
    ButtonRow = require("../dump/ButtonRow/ButtonRow");


var CommentForm = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ParkingStore", "CurrentUserStore")],

    propTypes: {},

    getInitialState: function () {
        return {
            text: ""
        }
    },

    render: function () {
        var commentWrapperClass = this.state.isAuthorized ? "Comment__Textarea-wrapper" : "Comment__Textarea-wrapper Comment__Textarea-wrapper_margin_false";
        return (
            <div>
                <div className="Comment">
                    { this.state.isAuthorized ?
                        <div className="Comment__AvatarWrapper">
                            <Avatar user={ this.state.currentUser } />
                        </div> : null }
                    <div className={ commentWrapperClass }>
                        <textarea
                            className="Comment__Textarea"
                            placeholder="Что еще надо знать другим мотоциклистам об этой парковке?"
                            value={ this.state.text }
                            onChange={ this.onTextChange }
                            onFocus={ this.onFocus }/>
                        <ButtonRow callback={ this.onSendComment } color="light" height="thin">Отправить
                            <Icon name="send" style={ {"fontSize": "0.8em"} }/>
                        </ButtonRow>
                    </div>
                </div>
            </div>
        );
    },

    onSendComment: function () {
        if (this.state.text) {
            this.getFlux().actions.postComment({
                parking: this.state.currentParkingId,
                text: this.state.text
            });
            this.setState({
                text: ""
            })
        }
    },

    onTextChange: function (e) {
        this.setState({
            text: e.target.value
        })
    },
    onFocus: function (e) {
        if (!this.state.isAuthorized) {
            this.getFlux().actions.authorizationRequired();
        }
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            currentParkingId: store.currentParkingId,
            currentUser: currentUserStore.currentUser,
            isAuthorized: currentUserStore.isAuthorized()
        };
    }
});

module.exports = CommentForm;
