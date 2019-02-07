/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './articleUpdate.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import EditorToolbar from '../EditorToolbar';
import { updateArticleAction } from '../../../../redux/actions/articleActions';


class ArticleUpdate extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      articleTitle: this.props.article.title,
      articleDescription: this.props.article.description,
      articleTags: this.props.article.tag,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const article = {
      title: this.state.articleTitle,
      description: this.state.articleDescription,
      body: document.getElementById('articleBody').value,
      tag: this.state.articleTags,
      artSlug: this.props.match.params.art_slug,
    };
    this.props.updateArticleAction(article);
    this.props.history.push('/');
  }

  render() {
    const articleBody = this.props.article.body;
    return (
      <div>
        <div className='container'>
          <form id='articleUpdateForm' method='post' encType='multipart/form-data' onSubmit={this.handleSubmit}>
            <ul className='article-update-form'>
              <li><label htmlFor='articleTitle'>Title</label></li>
              <li><input type='text' name='articleTitle' id='articleTitle' required defaultValue={this.props.article.title} onChange={this.onChange} /></li>
              <li><label htmlFor='articleDescription'>Description</label></li>
              <li><textarea name='articleDescription' id='articleDescription' required defaultValue={this.props.article.description} onChange={this.onChange} /></li>
              <li><label htmlFor='articleBody'>Body</label></li>
              <div id='toolbar-container' />
              <li><EditorToolbar article_body={articleBody} /></li>
              <li><label htmlFor='articleTags'>Tags</label></li>
              <li><input type='text' name='articleTags' id='articleTags' required defaultValue={this.props.article.tag} onChange={this.onChange} /></li>
              <li>
                <button type='submit' id='publishBtn' className='btn btn-default btn-lg'>
                  <i className='far fa-save' />
                  {' '}
                  Update
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const artSlug = ownProps.match.params.art_slug;
  const articleArray = state.articleReducer.articles.map(
    a => a.find(article => article.art_slug === artSlug),
  );
  return {
    article: articleArray[0],
  };
};
const mapDispatchToProps = { updateArticleAction };
export default connect(mapStateToProps, mapDispatchToProps)(ArticleUpdate);
