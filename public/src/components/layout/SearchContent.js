import { useState } from 'react';

// components
import SearchBar from '../search/SearchBar'

const SearchContent = (props) => {

  // Initialize the initial heroData and its modifier function
  const [heroData, setHeroData] = useState({ searchText: '' })

  // change the heroData with the value typed in the search box
  const searchTextChange = (e) => {
    setHeroData({ ...heroData, searchText: e.target.value })

    if ((e.keyCode == 13 || e.which == 13) && heroData.searchText) {
      props.searchByValue(heroData.searchText)
    }
  }

  const { searchText } = heroData

  return (
    <div className="hero-div">
      <SearchBar
        searchText={searchText}
        searchTextChange={searchTextChange}
        searchByValue={props.searchByValue}/>
              <span className="find-title">Search restaurant, place or cuisine</span>
    </div>
  );
};

export default SearchContent;
