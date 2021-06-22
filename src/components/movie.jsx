import React, { Component } from 'react'
import {getMovies} from "../services/fakeMovieService";
import Pagination from './common/pagination';
import { paginate } from './utils/paginate';
import ListGroup from './common/listGroup';
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";

class Movies extends Component {
    state = {
        movies: [],
        currentPage:1,
        pageSize: 5,
        genres: [],
        sortColumn: {path: "title", order: "asc"},
    }

    componentDidMount() {
        const genres = [{_id: "", name: "All Genres"}, ...getGenres()];
        this.setState({movies: getMovies(), genres});
    }

    handleDelete = (movie) => {
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({ movies });
    };

    handleGenreSelect = genre => {
        // console.log(genre);
        this.setState({selectedGenre: genre, currentPage: 1});// 这个设置currentPage就可以让

    }

    restart = () => {
        this.setState({ movies: getMovies() });
    }

    handleLike = (movie) => {
        console.log("this is handleLike", movie)
        // movie.liked = !movie.liked;
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = {...movies[index]};// 这里是为了深拷贝这里的东西才这么做的。
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
        // console.log("this is 2nd handleLike", this.state.movies[index])
    }

    handlePageChange = (page) => {
        // console.log(page);

        this.setState({ currentPage: page });
    }

    handleSort = path => {
        // console.log(path);
        const sortColumn = {...this.state.sortColumn};
        if (sortColumn.path === path) 
        sortColumn.order = (sortColumn.order === "asc") ? "desc" : "asc";
        else {
            sortColumn.path = path;
            sortColumn.order = "asc";
        }
        this.setState({ sortColumn })
    };

    
    render() {  
        const { length: cnt } = this.state.movies; // 解构取这里的长度。然后给这个起名字cnt
        const { pageSize, currentPage, selectedGenre, movies: allMovies, sortColumn } = this.state;

        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id): allMovies;
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        
        if (cnt === 0) 
        return ( // 如果这里的return被叫了，那么这里的
            <div>
            <p> There is nothing in the list right now ! </p>
            <button onClick={this.restart} className="btn btn-primary btn-sm">restart</button>
            </div>
            )

        const movies = paginate(sorted, currentPage, pageSize);

        return (
            <div className="row">
                <div className="col-3">
                    <ListGroup
                    // textProperty="name"
                    // valueProperty="_id"
                    items={this.state.genres} 
                    onItemSelect={this.handleGenreSelect}
                    selectedItem={this.state.selectedGenre}
                    />
                </div>
                <div className="col">
                <p className="mt-2">showing {filtered.length} movies in the database now. </p>
            <MoviesTable movies={movies} onLike={this.handleLike} onDelete={this.handleDelete} onSort={this.handleSort}/>
            <Pagination 
            // itemsCount={count} 
            pageSize={pageSize} 
            onPageChange={this.handlePageChange} 
            itemsCount={filtered.length}
            currentPage={currentPage}
            />
                </div>
            </div>
        )
    }
}

export default Movies;
