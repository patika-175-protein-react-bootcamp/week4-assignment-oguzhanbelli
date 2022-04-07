import "./App.css";
import { GameProvider } from "./contexts/GameContext";
import Router from "./router";

function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}

export default App;
