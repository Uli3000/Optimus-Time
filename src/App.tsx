import { AlertProvider } from "./components/AlertDialog"
import PomodoroApp from "./PomodoroApp"

function App() {

  return (
    <>
      <AlertProvider>
        <PomodoroApp />
      </AlertProvider>
    </>
  )
}

export default App
