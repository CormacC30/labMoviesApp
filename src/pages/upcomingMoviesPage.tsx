import React, { useState, useEffect } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { BaseMovieProps, DiscoverMovies } from "../types/interfaces";
import { getUpcomingMovies } from "../api/tmdb-api"; // need new import for upcoming movies from API
import Spinner from "../components/spinner"
import { useQuery } from "react-query";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { IconButton } from "@mui/material";
import { useMovies } from '../contexts/moviesContext';

const UpcomingMoviesPage: React.FC = () => {
  const { data, error, isLoading, isError } = useQuery<DiscoverMovies, Error>("upcoming movies", getUpcomingMovies);
   const [movies, setMovies] = useState<BaseMovieProps[]>([]);

   const { addToMustWatch } = useMovies();

   useEffect(() => {
    if (data && data.results) {
      setMovies(data.results);
    }
  }, [data]);

 // const movies = data ? data.results : [];
  // const favourites = movies.filter((m) => m.favourite);
  // localStorage.setItem("favourites", JSON.stringify(favourites));

  useEffect(() => {
    const favourites = movies.filter((m) => m.favourite);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [movies]);

  const addToFavourites = (movieId: number) => {
    const updatedMovies = movies.map((m: BaseMovieProps) =>
      m.id === movieId ? { ...m, favourite: true } : m
    );
    setMovies(updatedMovies);
  };


  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <PageTemplate
      title="Upcoming Movies"
      movies={movies}
      action={(movie: BaseMovieProps) => (
        <>
        <AddToFavouritesIcon {...movie} />
        <IconButton onClick={() => addToMustWatch(movie.id)}>
          <PlaylistAddIcon/>
        </IconButton>
        </>
      )
      }
      selectFavourite={addToFavourites}
    />
  );
};
export default UpcomingMoviesPage;
