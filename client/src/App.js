import './App.css';
import Header from './Header';
import Content from './Content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Services from './Services';
import Contact from './Contact';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <div>
    <Header  />
    <Routes>
      <Route path="/" element={<Content />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </div>
  );
}

export default App;
