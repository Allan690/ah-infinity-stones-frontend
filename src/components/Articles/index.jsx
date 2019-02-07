import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import ReactPaginate from 'react-paginate';
import { getAllArticlesRequestAction } from '../../redux/actions/articleActions';
import { errorMessage } from '../../helpers/messages';
import './Articles.scss';
import Loader from '../../views/Loader';

class GetAllArticles extends Component {
  constructor(props) {
    super(props);
    this.articlesList = [];
    this.state = {
      articlesPerPage: 5,
      selectedArticles: [],
      articlesList: [],
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.props.getAllArticlesRequestAction();
  }

  componentDidUpdate() {
    const initialSelection = [];
    const { selectedArticles } = this.state;
    const { articlesList } = this.state;
    const { header } = this.props;
    for (let i = 0; i < 5; i += 1) {
      initialSelection.push(this.articlesList[i]);
    }
    if (selectedArticles.length === 0) {
      this.setState({
        selectedArticles: initialSelection,
        articlesList: this.articlesList,
      });
      this.forceUpdate();
    } else if (header === 'SEARCH RESULTS') {
      if (this.props.articles[0]) {
        if (this.props.articles[0].length !== articlesList.length) {
          this.setState({
            selectedArticles: initialSelection,
            articlesList: this.articlesList,
          });
          this.forceUpdate();
        }
      }
    }
  }

  handlePageClick = (data) => {
    const { selected } = data;
    const selectedArticles = [];
    const { articlesPerPage } = this.state;
    for (let i = 0; i < articlesPerPage; i += 1) {
      selectedArticles.push(this.articlesList[selected * articlesPerPage + i]);
    }
    this.setState({ selectedArticles, currentPage: selected });
  };

  handlePerPageInput = (event) => {
    if (event.target.value > 0) {
      this.setState({ articlesPerPage: event.target.value });
      this.forceUpdate();
      const selectedArticles = [];
      for (let i = 0; i < event.target.value; i += 1) {
        selectedArticles.push(this.articlesList[i]);
      }
      this.setState({ selectedArticles });
    }
  }

  render() {
    const articles = this.props.articles[0];
    const { errorMsg } = this.props;
    if (errorMsg) {
      errorMessage(errorMsg);
    }
    this.articlesList = articles && articles.length ? (
      articles.map((article) => {
        return (
          <div
            className='card bg-light text-dark article-preview'
            classstyle='width: 18rem;'
            key={article.art_slug}
          >
            <div className='card-header'>
              <h5 className='card-title'>{article.title}</h5>
            </div>
            <div className='card-body'>
              <p
                className='card-text'
              >
                {article.description}
              </p>
            </div>
            <div className='card-footer text-right'>
              <Link to={`/articles/${article.art_slug}`} className='btn btn-sm btn-primary' id='read-more'>
                Read More...
              </Link>
            </div>
          </div>
        );
      })
    ) : (<div className='card'>No Articles Found</div>);
    return (
      this.state.selectedArticles.length > 0
        ? (
          <div>
            <div className='page-header text-center'><h3>{ this.props.header }</h3></div>
            <div className='container' id='allArticles'><div className='card-columns'>{ this.state.selectedArticles }</div></div>
            <table id='allArticlesPagination' className='table'>
              <tbody>
                <tr>
                  <td>
                    <input type='number' name='perPage' list='articlesPerPage' placeholder='articles per page' min='1' id='articlesPerPageInput' onChange={this.handlePerPageInput} />
                    <datalist id='articlesPerPage'>
                      <option value='5'>5</option>
                      <option value='10'>10</option>
                      <option value='20'>20</option>
                    </datalist>
                  </td>
                  <td>
                    <ReactPaginate
                      previousLabel='previous'
                      nextLabel='next'
                      breakLabel='...'
                      breakClassName='break-me'
                      pageCount={Math.ceil(this.articlesList.length / this.state.articlesPerPage)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName='pagination'
                      subContainerClassName='pages pagination'
                      activeClassName='active'
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (<div className='article'><Loader /></div>)
    );
  }
}
const mapStateToProps = state => ({
  articles: state.articleReducer.articles,
  header: state.articleReducer.header,
  errorMsg: state.articleReducer.searchErrorMsg,
});
GetAllArticles.propTypes = {
  errorMsg: PropTypes.func,
};
const actionCreators = {
  getAllArticlesRequestAction,
};

export default connect(
  mapStateToProps,
  actionCreators,
)(GetAllArticles);
