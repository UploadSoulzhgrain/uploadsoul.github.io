import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './core/router';
import AnimationStyles from './components/animations/AnimationStyles';

function App() {
  return (
    <BrowserRouter>
      <AnimationStyles />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;