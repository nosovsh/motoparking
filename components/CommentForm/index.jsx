var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Avatar = require("../Avatar"),
    Icon = require("../Icon"),
    ButtonRow = require("../ButtonRow");


var CommentForm = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ParkingStore", "CommentStore", "CurrentUserStore")],

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
                        <textarea className="Comment__Textarea"
                            placeholder="Что еще надо знать другим мотоциклистам об этой парковке?"
                            value={ this.state.text }
                            onChange={ this.onTextChange }/>
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

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var commentStore = this.getFlux().store("CommentStore");
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            currentParkingId: store.currentParkingId,
            currentUser: currentUserStore.currentUser
        };
    }
});

module.exports = CommentForm;
