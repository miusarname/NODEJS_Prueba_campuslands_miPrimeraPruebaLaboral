import './App.css'
import Comp from './components/comp.jsx';


function App() {
  return (
    <div className="App">
      <header className="bg-gray-200 p-4">
        <h1 className="text-2xl font-bold">Bodegas List</h1>
      </header>
      <main className="p-4">
        <Comp />
      </main>
    </div>
  );
}

export default App
