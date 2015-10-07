var React = require("react/addons");
var TimeoutTransitionGroup = require("react-components/js/timeout-transition-group");
var ReactRouter = require("react-router");
var History = ReactRouter.History;
var Link = ReactRouter.Link;

var Icon = require("../Icon/Icon");

require("./Sidebar.css");


/**
 * Sidebar component.
 *
 * Saves all compnents passed to it throught `this.props.children` to `this.state.pathStack`
 * and enables backward navigation if neccessary.
 */
var Sidebar = React.createClass({
  propTypes: {
    children: React.PropTypes.node,
    location: React.PropTypes.object,
    routes: React.PropTypes.array
  },

  mixins: [History],

  getInitialState: function() {
    return {
      pathStack: [],
      backward: false
    };
  },

  /**
   * Check if we are going back
   * @param nextProps
   */
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (nextProps.location.pathname === this.state.pathStack[this.state.pathStack.length - 1]) {
        this.setState({
          pathStack: this.state.pathStack.slice(0, this.state.pathStack.length - 1),
          backward: true
        });
      } else {
        this.setState({
          pathStack: this.state.pathStack.concat([this.props.location.pathname]),
          backward: false
        });
      }
    }
  },

  getKey: function() {
    return this.props.location.pathname;
  },

  goBack: function() {
    this.history.goBack();
  },

  render: function() {
    return (
      <div className="Sidebar">
        <div className="Sidebar__Content">
          { this.state.pathStack.length && (
          <a style={ {color: "#FFF"} } onClick={ this.goBack }>
            <div className="close-wrapper" style={{right: "inherit", left: 6}}>
              <Icon name="back" isExpandOnHover/>
            </div>
          </a>
          ) || null }

        <Link to="/" style={ {color: "#FFF"} }>
          <div className="close-wrapper">
            <Icon name="close" isExpandOnHover/>
          </div>
        </Link>

        <TimeoutTransitionGroup
          enterTimeout={ 200 }
          leaveTimeout={ 200 }
          transitionName={ this.state.backward && "SidebarAnimationBackward" || "SidebarAnimation" }>
          { React.Children.map(this.props.children, function(child) {
            return React.cloneElement(child, { key: this.getKey() });
          }.bind(this)) }
        </TimeoutTransitionGroup>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
