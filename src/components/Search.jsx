import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='search'>
      <div>
        <img src="search.svg" alt="serach" />

        <input type="text" placeholder='Search through thousands of movies' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
      </div>
    </div>
  )
}

export default Search
// This components is only keeping track of the search term itself not of the movies that are going to show below the search.