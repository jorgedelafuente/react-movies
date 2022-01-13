import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieInfo from "./Views/MovieInfo/MovieInfo.jsx";
import MovieList from "./Views/MovieList/MovieList.jsx";
import NavBar from "./Components/NavBar.jsx";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:slug" element={<MovieInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
