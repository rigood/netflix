/* Routing */
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Components */
import Header from "./Components/Header";

/* Pages */
import Home from "./Pages/Home";
import Tv from "./Pages/Tv";
import Search from "./Pages/Search";

function App() {
  /* v5 start with 방식으로 경로 매치, 배치순서 중요 */
  /* v6 full match 방식으로 경로 매치, 배치순서 무관 */
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<Home />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tv/:id" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/movies/:id" element={<Search />} />
        <Route path="/search/tv/:id" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;