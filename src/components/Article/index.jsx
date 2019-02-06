/* eslint-disable no-shadow, react/prop-types, react/destructuring-assignment, no-lonely-if, consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import StarRatings from 'react-star-ratings';
import PropTypes from 'prop-types';
import './Article.scss';
import { rateArticleAction,
  getOneArticleRequestAction,
  deleteArticleAction,
  reportArticleAction,
} from '../../redux/actions/articleActions';
import { sendLike } from '../../redux/actions/likeActions';
import jwtDecode from '../../../node_modules/jwt-decode';
import SocialShare from '../ArticleShare/shareArticle';
import ReportArticle from './ReportArticle';
import BookMarkArticle from '../Bookmark/bookmark';
import Loader from '../../views/Loader';

import Comment from '../../views/Comment';

class Article extends Component {
  constructor(props) {
    super(props);
    this.handleEditArticle = this.handleEditArticle.bind(this);
    this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
    this.author_only = React.createRef();
    this.reader_only = React.createRef();
    this.state = {
      rating: 0,
      buttonStatus: true,
    };
  }

  componentDidMount() {
    if (localStorage.getItem('Token') === null) {
      if (Object.keys(this.props.article).length === 0) {
        this.props.getOneArticleRequestAction(this.props.match.params.art_slug);
        return <Redirect to={this.props.match.params.art_slug} />;
      }
      this.author_only.current.style.visibility = 'hidden';
      this.author_only.current.style.display = 'none';
    } else {
      const token = `${localStorage.getItem('Token')}`;
      const decoded = jwtDecode(token);
      const tokenUsername = decoded.username;
      if (Object.keys(this.props.article).length === 0) {
        this.props.getOneArticleRequestAction(this.props.match.params.art_slug);
        this.props.history.push(this.props.article.art_slug);
      } else {
        if (tokenUsername === this.props.article.author.username) {
          this.reader_only.current.style.visibility = 'hidden';
          this.reader_only.current.style.display = 'none';
        } else {
          this.author_only.current.style.visibility = 'hidden';
          this.author_only.current.style.display = 'none';
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.props.article.author) {
      if (!(localStorage.getItem('Token') === null)) {
        const token = `${localStorage.getItem('Token')}`;
        const decoded = jwtDecode(token);
        const tokenUsername = decoded.username;
        if (tokenUsername === this.props.article.author.username) {
          this.reader_only.current.style.visibility = 'hidden';
          this.reader_only.current.style.display = 'none';
        } else {
          this.author_only.current.style.visibility = 'hidden';
          this.author_only.current.style.display = 'none';
        }
      }
    }
  }

  handleLike = () => {
    const { sendLike, match } = this.props;
    const isAuth = localStorage.getItem('isLoggedIn');
    return isAuth !== 'true'
      ? alert('You need to login')
      : sendLike({ like: 'True' }, match.params.art_slug);
  };

  handleDislike = () => {
    const { sendLike, match } = this.props;
    const isAuth = localStorage.getItem('isLoggedIn');
    return isAuth !== 'true'
      ? alert('You need to login')
      : sendLike({ like: 'False' }, match.params.art_slug);
  };

  // rating click handler
 handleRatingClick = (event) => {
   this.setState({
     rating: event,
     buttonStatus: false,
   });
   const payload = {
     art_slug: this.props.match.params.art_slug,
     rating: event,
   };
   const { rateArticleAction, rated } = this.props;
   const div = document.getElementById('msg');
   rateArticleAction(payload);
   if (!rated) {
     div.innerHTML = 'Thank you for rating this article.';
   }
   div.style.transition = 'opacity 6s';
   div.style.opacity = '0';
 }

 handleEditArticle() {
   this.props.history.push(`${this.props.article.art_slug}/edit`);
 }

 handleDeleteArticle(event) {
   event.preventDefault();
   this.props.deleteArticleAction(this.props.article.art_slug);
   this.props.history.push('/');
 }

  getSlug(){
    return this.props.match.params.art_slug
  }

  render() {
    const {
      article, likeCount, dislikeCount, liked, disliked,
    } = this.props;
    const isAuth = localStorage.getItem('isLoggedIn');
    let rate = 0;
    if(this.props.article.rating_average !== null){
      rate = parseInt(this.props.article.rating_average);
    }
    const singleArticle = Object.keys(article).length ? (
      <div className="article">
        <div className="row article">
          <div className="col-2">
            <div className="article-data">
              <div className="row">
                <span className="article-rating">
                  Average Rating
                 <div>
                   <StarRatings
                     rating={rate}
                     starRatedColor='#86C232'
                     starDimension='20px'
                     numberOfStars={5}
                     disabled
                     name='rating'
                   />
                 </div>
               </span>
             </div>
           </div>
         </div>
         <div className='col-8'>
           <h4 className='article-title'>{article.title}</h4>
           <div className='article-stats'>
             <span className='article-author'>{article.author.username}</span>
             <span className='article-read_time'>
               <i className='mdi mdi-calendar-clock mdi-24px' />
              &nbsp;
               {
                  article.read_time
                }
              &nbsp;
                Minute Read
             </span>
           </div>
           <div className='article-body'>{ReactHtmlParser(this.props.article.body)}</div>
           <div className='article-tags'>
             {
                this.props.article.tag.map(tag => (
                  <Link
                    className='art-fun'
                    to={`/tags/${tag}`}
                  >
                    {this.props.article.tag}
                  </Link>
                ))
              }
           </div>
           <div className='pull-right'>
             <span>
               {dislikeCount === null ? article.dislikes_count : dislikeCount}
                &nbsp;
             </span>
             <button
               type='button'
               id='dislike'
               className={`btn btn-primary btn-sm pull-right react-button ${
                 disliked === null
                   ? article.disliking && isAuth === 'true' && 'disliking'
                   : disliked && isAuth === 'true' && 'disliking'
               } `}
               onClick={this.handleDislike}
             >
                &nbsp;
               <i className='fa fa-thumbs-down mdi-24px' />
                &nbsp;
             </button>
           </div>
           <div className='pull-right'>
             <span>
               {likeCount === null ? article.likes_count : likeCount}
                &nbsp;
             </span>
             <button
               type='button'
               id='like'
               className={`btn btn-primary btn-sm pull-right react-button ${
                 liked === null
                   ? article.liking && isAuth === 'true' && 'liking'
                   : liked && isAuth === 'true' && 'liking'
               } `}
               onClick={this.handleLike}
               enabled
             >
               {' '}
                &nbsp;
               <i className='fa fa-thumbs-up mdi-24px' />
                &nbsp;
             </button>
           </div>
           {' '}
           <ReportArticle props={this.props} />
           <div className='row reader-only' ref={this.reader_only}>
             <div className='col article-report'>
                <button
                  type='button'
                  id='reportArticleButton'
                  className='btn btn-danger'
                  onClick={this.handleEditArticle}
                >
                  <i className='mdi mdi-alert' />
                  REPORT
                </button>
              </div>
            <BookMarkArticle
              slug={this.props.article.art_slug}
            />
             <div className='col' id='myRating'>
               <b>Rate This Article</b>
               <br />
               <StarRatings
                 rating={this.state.rating}
                 starRatedColor='#86C232'
                 starDimension='20px'
                 starHoverColor='#86C232'
                 changeRating={this.handleRatingClick}
                 numberOfStars={5}
                 disabled={this.state.buttonStatus}
                 name='rating'
               />
               <br />
               <span id='msg' />
             </div>
           </div>
           <div className='col article-social_media_urls'>
             <br />
             <SocialShare
               title={this.props.article.title}
               slug={this.props.article.art_slug}
             />
             <br />
           </div>
           <div id="article-comments">
              <h3>Comments</h3>
              {localStorage.getItem('Token')===null ? <Comment slug={this.getSlug()}/> : <Comment slug={this.getSlug()}/>}
            </div>
           <div />
         </div>
         <div className='col-2'>
           <div className='author-only' ref={this.author_only}>
             <button
               type='button'
               id='editArticleButton'
               className='btn btn-primary'
               onClick={this.handleEditArticle}
             >
               <i className='mdi mdi-pencil' />
                EDIT
             </button>
             <button
               type='button'
               id='deleteArticleButton'
               className='btn btn-danger'
               onClick={this.handleDeleteArticle}
             >
               <i className='mdi mdi-delete' />
                DELETE
             </button>
           </div>
         </div>
       </div>
       <div className='row' id='featured-articles'>
         <div className='col' />
         <div className='col' />
         <div className='col' />
       </div>
       <div className='row' id='article-comment'>
         <div className='col-2' />
         <div className='col-8' />
         <div className='col-2' />
       </div>
     </div>
   ) : (
     <div className='article'>
        <Loader />
     </div>
   );
   return <div className='container'>{singleArticle}</div>;
 }
}

const mapStateToProps = (state, ownProps) => {
  const artSlug = ownProps.match.params.art_slug;
  if (state.articleReducer.articles.length === 0) {
    return {
      article: state.articleReducer.article,
      rate: state.articleReducer.rate,
      error: state.articleReducer.error,
      rated: state.articleReducer.rated,
      success: state.likeReducer.success,
      likeCount: state.likeReducer.likeCount,
      dislikeCount: state.likeReducer.dislikeCount,
      liked: state.likeReducer.liked,
      disliked: state.likeReducer.disliked,
    };
  }
  return {
    article: state.articleReducer.articles[0].find(
      article => article.art_slug === artSlug,
    ),
    likeCount: state.likeReducer.likeCount,
    dislikeCount: state.likeReducer.dislikeCount,
    liked: state.likeReducer.liked,
    disliked: state.likeReducer.disliked,
  };
};

Article.propTypes = {
  sendLike: PropTypes.func.isRequired,
};

const actionCreators = {
  getOneArticleRequestAction,
  deleteArticleAction,
  sendLike,
  rateArticleAction,
  reportArticleAction,
};

export default connect(
  mapStateToProps,
  actionCreators,
)(Article);
