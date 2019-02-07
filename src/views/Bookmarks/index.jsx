/* eslint-disable arrow-body-style, no-nested-ternary, react/require-default-props */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Bookmark from '../../components/Bookmark';
import { requestBookmarks } from '../../redux/actions/bookmarksActions';
import Loader from '../Loader';
import '../Login/Login.scss';
import './Bookmarks.scss';


class Bookmarks extends Component {
  componentDidMount() {
    const { requestBookmarks } = this.props;
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn === 'true' && requestBookmarks();
  }

  render() {
    const { bookmarks, bookmarksError } = this.props;
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const location = '/bookmarks';
    const bookmarksList = bookmarks && bookmarks.length ? (
      bookmarks.map((bookmark) => {
        return (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        );
      })
    ) : (
      bookmarks.length === 0 && bookmarksError !== null
        ? (
          <div>
            <h6>No Available Bookmarks</h6>
            <Link to='/profile'>
              <i className='fas fa-chevron-circle-left' />
              Back to Profile
            </Link>
            {' | '}
            <Link to='/'>
              <i className='fab fa-readme' />
              View Articles
            </Link>
          </div>
        ) : (<div id='loader-container' className='text-center'><Loader /></div>)
    );
    return (
      isLoggedIn !== 'true'
        ? (
          <div
            className='container jumbotron text-center'
          >
            <Link to={{
              pathname: '/login',
              from: location,
            }}
            >
            Please log in
            </Link>
          </div>
        )
        : (
          <div className='card text-center'>
            <div className='card-header'>
              <h3>Bookmarked Articles</h3>
            </div>
            <div className='card-body'>
              {bookmarksList}
            </div>
          </div>
        )
    );
  }
}

Bookmarks.propTypes = {
  requestBookmarks: PropTypes.func.isRequired,
  bookmarks: PropTypes.arrayOf(PropTypes.object).isRequired,
  bookmarksError: PropTypes.string,
};

const mapStateToProps = state => ({
  bookmarks: state.bookmarksReducer.bookmarks,
  bookmarksError: state.bookmarksReducer.error,
});

const actionCreators = { requestBookmarks };

export default connect(mapStateToProps, actionCreators)(Bookmarks);
