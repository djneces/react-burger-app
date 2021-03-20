import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
  // class and state here, Layout has access to both Toolbar and SideDrawer to handle click => opening/closing
  state = {
    showSideDrawer: false,
  };

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    //use prevState func due to async nature, to capture prev. state
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    //adjacent elements must be wrapped = instead of div I use Aux func in hoc
    return (
      <Aux>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHandler}
        />
        <SideDrawer
          isAuth={this.props.isAuthenticated}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

//we connect to store here, because we need to pass isAuthenticated props over to navigation items (to show logout dynamically)
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null, // if not equal to null => is authenticated
  };
};
export default connect(mapStateToProps)(Layout);
