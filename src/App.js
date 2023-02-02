// import logo from './logo.svg';
import './App.scss';
import "./assets/styles/_variables.scss";
// import "./assets/styles/backImage.scss";
// import "./assets/styles/inputValid.scss";
import Footer from './components/Footer';
import Header from './components/Header';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
// import SignIn from './Pages/Sign in/signIn';
// import SignUp from './Pages/Sign up/signUp';
// import Profile from './Pages/Profile/profile';
// import Categories from './Pages/Categories/categories';

function App() {
  return (
    <div>
      <Header/>

      <Routes>
        <Route path="login" element={<Login/>}/>
        {/* <Route path="sign-up" element={<SignUp/>}/> */}
        {/* <Route path="categories/*" element={<Categories/>}/> */}
        {/* <Route path=":name" element={<Profile/>}/> */}
      </Routes>

      <Footer/>
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

  );
}

export default App;
