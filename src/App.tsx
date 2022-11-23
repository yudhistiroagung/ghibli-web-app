import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

type Movie = {
  id: string;
  title: string;
  original_title: string;
  original_title_romanised: string;
  description: string;
  director: string;
  directorproducer: string;
  rt_score: string;
  image: string;
  movie_banner: string;
};

const fetchMovies = async (): Promise<Movie[]> => {
  return (await fetch("https://ghibliapi.herokuapp.com/films")).json();
};

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const searchChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(() => e.target.value);
  }, []);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      setMovies((prev) => [...prev.splice(0, 0), ...data]);
    } catch (e) {
      console.log("ERROR", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const displayedMovies = !!filteredMovies.length ? filteredMovies : movies;

  useEffect(() => {
    if (search) {
      const filtered = movies.filter(({ title }) =>
        title.toLowerCase().includes(search.toLocaleLowerCase())
      );
      setFilteredMovies((prev) => [...prev.splice(0, 0), ...filtered]);
    } else {
      setFilteredMovies((prev) => [...prev.splice(0, 0)]);
    }
  }, [search]);

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <p className="text-white m-auto">Loading...</p>;

  return (
    <div className="w-full flex h-screen">
      <div className="container mx-auto">
        <header className="flex flex-row sticky top-0 z-30 w-full px-2 py-4 bg-black justify-center shadow-xl">
          <input
            onChange={searchChanged}
            className="px-2 py-2 rounded-lg w-4/12"
            placeholder="Search movie..."
          />
        </header>

        <section className="grid grid-cols-4 gap-4">
          {!!displayedMovies.length &&
            displayedMovies.map((movie: Movie) => {
              return (
                <div
                  key={`${movie.id}`}
                  className="flex flex-col-reverse h-72 rounded-lg bg-white relative overflow-clip"
                >
                  <img
                    className="h-72 w-full absolute object-cover"
                    src={movie.image}
                    alt={movie.title}
                  />
                  <div className="flex flex-col-reverse h-36 p-4 w-full z-0 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white text-sm">{movie.original_title}</p>
                    <p className="text-white text-lg font-bold font-sans">
                      {movie.title}
                    </p>
                  </div>
                </div>
              );
            })}
        </section>
      </div>
    </div>
  );
}
