import React, { Component } from 'react';
import classes from './Modal.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  // => Modal is not updating if we adding ingredients, orderSummary is not updating either
  //updates first when we click order and modal appears, => Modal and orderSummary update
  //OrderSummary is within Modal in BurgerBuilder
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    ); //children -> it affects orderSummary, to show a spinner
  }

  componentWillUpdate() {
    // **testing
    // console.log('[Modal] WillUpdate');
  }

  render() {
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0',
          }}
        >
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default Modal;
