import { useState } from "react"
import Header from "../../components/Header/Header"
import NewStream from "../../components/NewStream/NewStream"
import "./HomePage.scss"
import DisplayStreams from "../../components/DisplayStreams/DisplayStreams"
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal"

const HomePage = () => {
  const [openNewStreamForm, setOpenNewStreamForm] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState("")
  return (
    <div className="homePage">
      <Header />
      <div className="homePage_content">
        {!!transactionSignature && (
          <ConfirmationModal
            transactionSignature={transactionSignature}
            setTransactionSignature={setTransactionSignature}
          />
        )}
        {openNewStreamForm ? (
          <NewStream
            setOpenNewStreamForm={setOpenNewStreamForm}
            setTransactionSignature={setTransactionSignature}
          />
        ) : (
          <DisplayStreams setOpenNewStreamForm={setOpenNewStreamForm} />
        )}
      </div>
    </div>
  )
}

export default HomePage
