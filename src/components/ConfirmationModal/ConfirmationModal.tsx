import React, { FC } from "react"
import Button from "../UI-elements/Button/Button"
import "./ConfirmationModal.scss"

interface ConfirmationModalProps {
  transactionSignature: string
  setTransactionSignature: (value: string) => void
}
const ConfirmationModal: FC<ConfirmationModalProps> = ({
  transactionSignature,
  setTransactionSignature,
}) => {
  return (
    <div className="transactionSignatureModal">
      <div className="transactionSignatureModal_content">
        <p className="transactionSignatureModal_content-title">
          Transaction Signature
        </p>
        <p className="transactionSignatureModal_content-text">
          {transactionSignature}
        </p>
        <Button label="Close" onClick={() => setTransactionSignature("")} />
      </div>
    </div>
  )
}

export default ConfirmationModal
