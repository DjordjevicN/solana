import "./Header.scss"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

const Header = () => {
  return (
    <div className="header">
      <div className="header_content">
        <div className="header_content-logo">
          <p className="topText">TASK</p>
          <p className="bottomText">Streamflow</p>
        </div>
        <div className="header_content-connectBtn">
          <WalletMultiButton />
        </div>
      </div>
    </div>
  )
}

export default Header
