import React from 'react';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <AuthProvider>
      nice to meet u Aman
    </AuthProvider>
  );
}

export default App;