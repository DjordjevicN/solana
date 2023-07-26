import { useState } from "react"
import Header from "../../components/Header/Header"
import NewStream from "../../components/NewStream/NewStream"
import "./HomePage.scss"
import DisplayStreams from "../../components/DisplayStreams/DisplayStreams"

const HomePage = () => {
  const [openNewStreamForm, setOpenNewStreamForm] = useState(false)
  return (
    <div className="homePage">
      <Header />
      <div className="homePage_content">
        {openNewStreamForm ? (
          <NewStream setOpenNewStreamForm={setOpenNewStreamForm} />
        ) : (
          <DisplayStreams setOpenNewStreamForm={setOpenNewStreamForm} />
        )}
      </div>
    </div>
  )
}

export default HomePage
