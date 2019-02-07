/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import Articles from './index';
import store from '../../redux/store';
import * as actions from '../../redux/actions/articleActions';
import {
  GET_ALL_ARTICLES_REQUEST,
  GET_ALL_ARTICLES_SUCCESS,
  GET_ALL_ARTICLES_FAILURE,
} from '../../redux/actions/actionTypes';


import { getAllArticles } from '../../services/articlePayload';
import { baseURL } from '../common/constants';

describe('All Articles Component', () => {
  let articlesContainer;
  let reduxArticles;
  beforeEach(() => {
    articlesContainer = shallow(<Articles />);
    reduxArticles = mount(
      <Provider store={store}>
        <BrowserRouter>
          <Articles />
        </BrowserRouter>
      </Provider>,
    );
  });
  it('All Articles Component renders successfully', () => {
    // let article_div = articlesContainer.find('div')
    expect(articlesContainer.exists()).toEqual(true);
  });
  it('articles component should match snapshot', () => {
    expect(articlesContainer.getElements()).toMatchSnapshot();
  });
});

describe('Action Creators', () => {
  let articlesContainer;
  let reduxArticles;
  beforeEach(() => {
    articlesContainer = shallow(<Articles />);
    reduxArticles = mount(
      <Provider store={store}>
        <BrowserRouter>
          <Articles />
        </BrowserRouter>
      </Provider>,
    );
  });
  it('should return a promise', () => {
    expect(getAllArticles()).toBeTruthy();
  });
  it('should send a GET all articles request', () => {
    const expectedAction = {
      type: GET_ALL_ARTICLES_REQUEST,
    };
    expect(actions.getAllArticlesRequestAction()).toEqual(expectedAction);
  });
});

describe('Show all articles', () => {
  it('should update the articles to the state', () => {
    const articles = '{art_slug: "how-to-make", author: "Ronny",body: "You have to pray", description: "Ever wonder how?"}';
    const expectedAction = {
      type: GET_ALL_ARTICLES_SUCCESS,
      payload: [articles],
    };
    expect(actions.getAllArticlesSuccessAction(articles)).toEqual(expectedAction);
  });
  it('should catch error', () => {
    const error = '{type: "cors", url: "https://cors-anywhere.herokuapp.com/ah-infinites-staging.herokuapp.com/api/articles", redirected: false, status: 500, ok: falsee';
    const expectedAction = {
      type: GET_ALL_ARTICLES_FAILURE,
      payload: error,
    };
    expect(actions.getAllArticlesFailureAction(error)).toEqual(expectedAction);
  });
});
