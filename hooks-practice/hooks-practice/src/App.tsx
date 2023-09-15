import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Pokemon, getByName } from './API';

import './styles.css';

interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

let tableRender = 0;

const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
  console.log(`tableRender = ${tableRender++}`);

  return (
    <table>
      <thead>
        <tr>
          <td>No.</td>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p, idx) => (
          <tr key={p.id}>
            <td style={{ fontWeight: 'bold' }}>{idx + 1}</td>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(',')}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// const PokemonTableMemoed = React.memo(PokemonTable);

let appRender = 0;

export default function App() {
  console.log(`appRender = ${appRender++}`);

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [threshold, setThreshold] = useState(0);

  const onSetSearch = useCallback((evt) => setSearch(evt.target.value), []);

  useEffect(() => {
    getByName(search).then(setPokemon);
  }, [search]);

  const pokemonWithPower = useMemo(
    () =>
      pokemon
        .map((p) => ({
          ...p,
          power: calculatePower(p),
        }))
        .filter((p) => p.power > threshold),
    [pokemon, threshold]
  );

  // Note: filter used only for practice, we can use instead pokemonWithPower.length;
  const countOverThreshold = useMemo(
    () => pokemonWithPower.filter((p) => p.power > threshold).length,
    [pokemonWithPower, threshold]
  );

  const min = useMemo(
    () => Math.min(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );
  const max = useMemo(
    () => Math.max(...pokemonWithPower.map((p) => p.power)),
    [pokemonWithPower]
  );

  const onSetThreshold = useCallback(
    (evt) => setThreshold(evt.target.value ? parseInt(evt.target.value, 10) : 0),
    []
  );

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" value={search} onChange={onSetSearch}></input>
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold}></input>
        <div>Count over threshold: {countOverThreshold}</div>
        <span className="min-max">
          <span>
            | Min: {min} | Max: {max} |
          </span>
        </span>
      </div>
      <div className="two-column">
        <PokemonTable pokemon={pokemonWithPower} />
      </div>
    </div>
  );
}
