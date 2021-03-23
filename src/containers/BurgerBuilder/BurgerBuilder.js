import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

export class BurgerBuilder extends Component {
  //constructor(props) {
  //     super(props);
  //     this.state = {...}
  // }

  //Local state
  state = {
    purchasing: false, //modal
  };

  // set up the state dynamically - fetch data - componentDidMount
  componentDidMount = () => {
    this.props.onInitIngredients();
  };

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((acc, el) => acc + el, 0);
    return sum > 0; //true/false
  };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      //where should user go after (changes the path for the user after login)
      this.props.onSetAuthRedirectPath('/checkout');
      //history comes from React Router
      this.props.history.push('/auth');
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  };

  render() {
    const disabledInfo = {
      ...this.props.ings,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; //updates {} eg: bacon: true, salad: false etc.
    }

    let orderSummary = null;

    //set the spinner until we fetch data from the DB
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded'</p>
    ) : (
      <Spinner />
    );
    //if I have fetched the data-ingredients, show this
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            //we need to execute when loads
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            //we can build burger, but after click on order btn proceeds only authenticated user
            isAuth={this.props.isAuthenticated}
            price={this.props.price}
          />
        </Aux>
      );
      //summary also waiting for the ingredients from the DB
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

//which property receives which slice of state, we change local state for props in the code
const mapStateToProps = (state) => {
  return {
    //state.ingredients from the reducer => in burgerBuilder reducer
    ings: state.burgerBuilder.ingredients,
    //we need to fetch the price from reducer
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //dispatches an object
    // prettier-ignore
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),

    // prettier-ignore
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),

    onInitIngredients: () => dispatch(actions.initIngredients()),

    onInitPurchase: () => dispatch(actions.purchaseInit()),
    // prettier-ignore
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
  };
};

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
