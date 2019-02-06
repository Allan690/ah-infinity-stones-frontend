/* eslint-disable no-shadow, class-methods-use-this, react/sort-comp, react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoginForm from '../../components/Forms/LoginForm';
import { requestLogin } from '../../redux/actions/loginActions';
import { errorMessage, successMessage } from '../../helpers/messages';
import Loader from '../Loader';
import './Login.scss';


class Login extends Component {
  state = {
    email: '',
    password: '',
    inputErrors: { email: '', password: '' },
    isValid: { email: false, password: false },
    submitEnabled: false,
  };

  static defaultProps = {
    loading: false,
    success: null,
    error: null,
    isLoggedIn: null,
  };

  handleLogin = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    localStorage.setItem('email', email);
    const { requestLogin } = this.props;
    requestLogin({ email, password });
    this.setState({
      email: '',
      password: '',
    });
  };

  static handleSuccess = (message) => {
    successMessage(message);
    return <Redirect to='/' />;
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => this.validateInput(name, value));
  };

  static errorClass(error) {
    return (error.length === 0 ? '' : 'is-invalid');
  }

  canSubmit() {
    const { isValid } = this.state;
    this.setState({ submitEnabled: isValid.email && isValid.password });
  }

  validateInput(name, value) {
    const { inputErrors, isValid } = this.state;
    const inputValidationErrors = inputErrors;
    const validity = isValid;
    const emailRegex = /^[\w.-]+@([\w-]+)\.+\w{2,}$/i;
    const isEmail = name === 'email';

    validity[name] = value.length > 0;
    inputValidationErrors[name] = validity[name] ? '' : `${name} is required`;

    if (validity[name]) {
      if (isEmail) {
        validity[name] = emailRegex.test(value);
        inputValidationErrors[name] = validity[name] ? '' : `${name} is invalid`;
      }
    }

    this.setState({
      inputErrors: inputValidationErrors,
      isValid: validity,
    }, () => this.canSubmit());
  }

  render() {
    const {
      error, success, loading, isLoggedIn,
    } = this.props;
    const { submitEnabled, email, password } = this.state;
    return (
      <div className='container' id='loginContainer'>
        {error !== null ? errorMessage(error) : null}
        {success !== null ? Login.handleSuccess(success) : null}
        {loading === true ? <Loader /> : null}
        {localStorage.removeItem('isLoggedIn')}
        {localStorage.setItem('isLoggedIn', isLoggedIn)}
        <LoginForm
          handleChange={this.handleChange}
          handleLogin={this.handleLogin}
          errors={this.state}
          errorClass={Login.errorClass}
          submitEnabled={submitEnabled}
          email={email}
          password={password}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  success: state.loginReducer.success,
  error: state.loginReducer.error,
  loading: state.loginReducer.loading,
  isLoggedIn: state.loginReducer.isLoggedIn,
});

Login.propTypes = {
  success: PropTypes.string,
  error: PropTypes.string,
  requestLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};
const actionCreators = { requestLogin };

export default connect(mapStateToProps, actionCreators)(Login);
