// dependencies
import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// components
import SearchBar from './search/SearchBar'
import RestaurantPanel from './RestaurantPanel'
import Loading from './Loading'
import { SearchProvider, SearchConsumer } from './search/SearchContext'

// constants
import Constants from './Constants'

import AuthService from "../services/Authservice";

const Content = (props) => {

  // Initialize the initial content and its modifier function
  const [content, setContent] = useState(
    {
      restaurants: [],
      showLoading: false,
      modifyOrig: false,
      responseId: '',
      searchText: props.searchText
    })

  const allConstants = Constants()

  const searchTextChange = (e) => {
    // change the content with the value typed in the search box
    setContent({ ...content, searchText: e.target.value })
    if (e.keyCode == 13 || e.which == 13) {
      searchByValue()
    }
  }

  useEffect(() => {
    getRestaurants()
  }, [])

  const searchByValue = (e) => {
  if(content.searchText != "") {
      // if ENTER key is pressed
      console.log('ENTER key pressed / SEARCH button clicked...', content.searchText)

      // API call to the back end
      getRestaurants()
    }else{
      alert("Search text should not be empty")
    }
  }

  // get all the restaurants
  const getRestaurants = async (url, data) => {
    // set content to show the Loading icon
    setContent({ ...content, showLoading: true })

    const searchText = (content.searchText && (props.searchText !== content.searchText)) ? content.searchText : props.searchText
    const axiosConfig = {
      url: (url) ? url : allConstants.getRestaurants.replace('{value}', searchText),
      method: allConstants.method.POST,
      headers: {...allConstants.header,  "x-access-token": AuthService.getCurrentUser().token},
    }

    if (data) {
      axiosConfig["data"] = data
    }

    try {
      const res = await axios(axiosConfig)

      // add the response along with an unique id for each response
      setContent({ restaurants: [...res.data], showLoading: false, modifyOrig: true, responseId: uuidv4() })
    } catch (err) {
      setContent({...content, showLoading: false })
      console.log('unable to get the data', err)
    }
  }

  const { restaurants, showLoading, modifyOrig, responseId } = content
  // console.log('content in the Content', content)

  return (
    <div className="content-div">
      <div className="content-div-search-bar">
        <SearchBar
          searchText={content.searchText}
          searchByValue={searchByValue}
          searchTextChange={searchTextChange} />
      </div>
      {(showLoading == true) && <Loading />}
      <SearchProvider value={searchByValue}>
        <RestaurantPanel showLoading={showLoading} restaurants={restaurants} modifyOrig={modifyOrig} responseId={responseId} />
      </SearchProvider>
    </div>
  );
}

export default Content;
