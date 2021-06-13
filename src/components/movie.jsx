import React, { Component } from 'react'
import {getMovies} from "../services/fakeMovieService";
import Like from "./common/like";
import Pagination from './common/pagination';
import { paginate } from './utils/paginate';

class Movies extends Component {
    state = {
        movies: getMovies(),
        currentPage:1,
        pageSize: 4,
    }

    handleDelete = (movie) => {
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({ movies });
    };

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

    
    render() {  
        const { length: cnt } = this.state.movies; // 解构取这里的长度。然后给这个起名字cnt
        const { pageSize, currentPage, movies: allMovies } = this.state;
        
        if (cnt === 0) 
        return ( // 如果这里的return被叫了，那么这里的
            <div>
            <p> There is nothing in the list right now ! </p>
            <button onClick={this.restart} className="btn btn-primary btn-sm">restart</button>
            </div>
            )

        const movies = paginate(allMovies, currentPage, pageSize);

        return (
            <React.Fragment>
            <p className="mt-2">showing {cnt} movies in the database now. </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Stock</th>
                        <th>Rate</th>
                        <th>Like</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map( movie => 
                    <tr key={movie._id}>
                        <td >{movie.title}</td>
                        <td>{movie.genre.name}</td>
                        <td>{movie.numberInStock}</td>
                        <td>{movie.dailyRentalRate}</td>
                        <td><Like liked={movie.liked} onLikeToggle={() => this.handleLike(movie)}/></td>
                        <td><button onClick={() => this.handleDelete(movie)} className="btn btn-danger btn-sm">Delete</button></td>
                    </tr>
                        )}
                    
                </tbody>
            </table>
            <Pagination 
            // itemsCount={count} 
            pageSize={pageSize} 
            onPageChange={this.handlePageChange} 
            itemsCount={cnt}
            currentPage={currentPage}
            />
            </React.Fragment>
        )
    }
}

export default Movies;