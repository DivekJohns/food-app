import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

// components 
import Header from './components/layout/Header';
import Content from './components/Content';
import SearchContent from './components/layout/SearchContent'

// css
import './css/style.css'
import Login from './components/Login';
import AuthService from './services/AuthService'
const App = () => {

  const user = AuthService.getCurrentUser()

  // Initialize the initial state and its modifier function
  const [panelData, setPanelData] = useState(
    {
      showContent: false,
      searchText: '',
      loggedIn: user ? true : false,
    })


  const searchByValue = (searchTextNew) => {
    console.log('Search text is now', searchTextNew)
    if (searchTextNew) {
      setPanelData({ ...panelData, showContent: true, searchText: searchTextNew })
    }
  }

  const loginSuccess= () =>  {
    setPanelData({ ...panelData, loggedIn: true})
  }


  return (
    <BrowserRouter>
      <div className="container">
        { /* including the Title and other components */}
        <Header />
        {panelData.loggedIn ? (panelData.showContent == false && panelData.loggedIn)
          ? <SearchContent searchByValue={searchByValue} />
          : <Content searchText={panelData.searchText} /> : <Login loginSuccess={loginSuccess}/>}
      </div>
    </BrowserRouter>
  );
}

export default App;
