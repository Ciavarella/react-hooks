import * as React from 'react'
import { fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import { PokemonForm } from '../pokemon'

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    const { error } = this.state
    if(error) {
      return (
        <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null
  })
  const { status, pokemon, error } = state


  React.useEffect(() => {
    if(!pokemonName) {
      return
    }

    setState({ status: 'pending' })
    fetchPokemon(pokemonName).then(
      pokemon => { setState({ pokemon, status: 'resolved' }) },
      error => { setState({ status: 'rejected', error }) }
    )
  }, [pokemonName])

  if(status === 'idle') {
    return 'Submit a pokemon' 
  } else if(status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} /> 
  } else if(status === 'rejected') {
    throw error
  } else if(status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
