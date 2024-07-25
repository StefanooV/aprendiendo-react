import './App.css'
import { useMovies } from './hooks/useMovie.js'
import { Movies } from './components/Movies.jsx'
import { useState, useEffect, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'


function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true) 

  useEffect(() => {
    if (isFirstInput.current){
      isFirstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('No se puede buscar una pelicula vacía')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula con un numero')
      return
    }
    if (search.length < 3) {
      setError('La busqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  }, [search])

  return {search, updateSearch, error}
}

function App() {
  const [sort, setSort] = useState(false)
  const {search, updateSearch, error} = useSearch()
  const {movies, loading, getMovies} = useMovies({search, sort})

  const debounceGetMovies = useCallback(
    debounce(search => {
      getMovies({ search }) 
    }, 500)
  , [getMovies])

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({search})
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value 
    updateSearch(newSearch)
    debounceGetMovies(newSearch)
  } 

  return (
      <div className='page'>
        
        <header>
          <h1>Buscador de peliculas</h1>
          <form className='form' onSubmit={handleSubmit}>
            <input onChange={handleChange} value={search} name='query' type="text" placeholder='Avengers, Star Wars, ...'/>
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <button type='submit'>Buscar</button>
          </form>
          {error && <p style={{color: 'red' }}>{error}</p>}
        </header>

        <main>
          {
            loading ? <p>Cargando...</p> : <Movies movies={movies} />
          }
        </main>
      </div>
  )
}

export default App
