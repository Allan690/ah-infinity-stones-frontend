/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import GetAllArticles from '../../components/Articles';
import './allArticles.scss';

const AllArticlesView = () => (
  <div className='page-wrap'>
    <GetAllArticles />
    <div id='article_write'>
      <div id='write_button'>
        <Link to='/articles'>
          <button className='btn btn-default' type='button'>
            <i className='far fa-edit' />
            {' '}
            Write Your Story
          </button>
        </Link>
      </div>
    </div>
  </div>

);

export default AllArticlesView;
