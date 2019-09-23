import React, { Component } from "react";
import axios from "axios";
// import authors from "./data.js";

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";

class App extends Component {
  state = {
    currentAuthor: null,
    filteredAuthors: [],
    authors: [],
    loading: true
  };

  async componentDidMount() {
    try {
      const response = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );
      const authors = response.data;
      this.setState({
        authors: authors,
        filteredAuthors: authors,
        loading: false
      });
    } catch (error) {
      console.error("Error !!!");
      console.error(error);
    }
  }

  selectAuthor = async author => {
    let authorid = author.id;
    try {
      const response = await axios.get(
        `https://the-index-api.herokuapp.com/api/authors/${authorid}`
      );
      const authors = response.data;
      this.setState({
        currentAuthor: authors,
        filteredAuthors: authors,
        loading: true
      });
    } catch (error) {
      console.error("Error !!!");
      console.error(error);
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  filterAuthors = query => {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`
        .toLowerCase()
        .includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  };

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      if (this.state.loading) {
        return <Loading />;
      } else {
        return (
          <AuthorsList
            authors={this.state.filteredAuthors}
            selectAuthor={this.selectAuthor}
            filterAuthors={this.filterAuthors}
          />
        );
      }
    }
  };

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
