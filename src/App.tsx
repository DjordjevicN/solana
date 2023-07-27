import "@solana/wallet-adapter-react-ui/styles.css"
import HomePage from "./pages/HomePage/HomePage"
import ContextProvider from "./components/context/ContextProvider"
import React, { FC, ReactNode, useMemo } from "react"
const App: FC = () => {
  return (
    <ContextProvider>
      <HomePage />
    </ContextProvider>
  )
}
export default App
