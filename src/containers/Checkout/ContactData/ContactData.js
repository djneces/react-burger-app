import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: '',
    },
    loading: false,
  };

  orderHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });
    // alert('You continue');
    const order = {
      ingredients: this.props.ingredients,
      //in production we calculate price on the server = avoid user data manipulation
      price: this.props.price,
      customer: {
        name: 'John Doe',
        address: {
          street: 'Test street 1',
          zipCode: 123,
          country: 'CZ',
        },
        email: 'test@test.com',
      },
      deliveryMethod: 'fastest',
    };
    //firebase needs .json!!!
    axios
      .post('/orders.json', order)
      .then((response) => {
        this.setState({ loading: false }); //after post, remove the spinner,
        //we had to pass ...props from Checkout, so push works here (so we have access to history)
        this.props.history.push('/');
      })
      .catch((error) => {
        this.setState({ loading: false }); //remove spinner here, so user doesn't expect results
      });
  };

  render() {
    let form = (
      <form>
        <input
          className={classes.Input}
          type='text'
          name='name'
          placeholder='Your Name'
        />
        <input
          className={classes.Input}
          type='email'
          name='email'
          placeholder='Your Email'
        />
        <input
          className={classes.Input}
          type='text'
          name='street'
          placeholder='Your Street'
        />
        <input
          className={classes.Input}
          type='text'
          name='postal'
          placeholder='Postal Code'
        />
        <Button btnType='Success' clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
