import { FC, useEffect, useState } from "react"
import "./DisplayStreams.scss"
import Button from "../UI-elements/Button/Button"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { StreamClient, Cluster, Stream } from "@streamflow/stream"
import { RPC_CLUSTER_URL } from "../../constants/addresses"

interface DisplayStreamsProps {
  setOpenNewStreamForm: (open: boolean) => void
}
interface UserStreams {
  contract: Stream
  id: string
}

const DisplayStreams: FC<DisplayStreamsProps> = ({ setOpenNewStreamForm }) => {
  const wallet = useWallet()
  const [streams, setStreams] = useState<UserStreams[]>([])

  const getStreams = async (walletKey: PublicKey) => {
    try {
      const client = new StreamClient(
        RPC_CLUSTER_URL,
        Cluster.Devnet,
        "confirmed"
      )
      const response = await client.get({ wallet: walletKey })
      setStreams(response.map((item) => ({ id: item[0], contract: item[1] })))
    } catch (error) {
      console.error("Error fetching streams:", error)
    }
  }

  useEffect(() => {
    if (wallet.connected) {
      // @ts-ignore
      getStreams(wallet.publicKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected])

  const checkStatus = (stream: Stream): string => {
    const currentTimestamp = Date.now() / 1000
    if (stream.canceledAt) return "Canceled"
    if (currentTimestamp > stream.end) return "Completed"
    if (currentTimestamp < stream.start) return "Scheduled"
    return "Streaming"
  }

  const hidePartOfAddress = (address: string) => {
    const firstPart = address.slice(0, 5)
    const lastPart = address.slice(-5)
    return `${firstPart}...${lastPart}`
  }

  return (
    <div className="displayStreams">
      <div className="displayStreams_content">
        <Button
          label="Create new stream"
          onClick={() => setOpenNewStreamForm(true)}
        />

        <div className="displayStreams_content-table">
          <div className="displayStreams_content-table-header">
            <div className="displayStreams_content-table-header-item">
              Status
            </div>
            <div className="displayStreams_content-table-header-item">
              Subject
            </div>
            <div className="displayStreams_content-table-header-item">
              Address
            </div>
            <div className="displayStreams_content-table-header-item">
              Starting Date
            </div>
          </div>
          <div className="displayStreams_content-table-body">
            {streams.length > 0 &&
              streams.map((stream) => {
                const startingDate = new Date(stream.contract.start * 1000)
                  .toDateString()
                  .split(" ")
                  .slice(1)
                  .join(" ")
                return (
                  <div
                    key={stream.id}
                    className="displayStreams_content-table-body-row"
                  >
                    <div className="displayStreams_content-table-body-item">
                      {checkStatus(stream.contract)}
                    </div>
                    <div className="displayStreams_content-table-body-item">
                      {stream.contract.name.replace(/\u0000/g, "")}
                    </div>
                    <div className="displayStreams_content-table-body-item">
                      <p className="text">{hidePartOfAddress(stream.id)}</p>
                    </div>
                    <div className="displayStreams_content-table-body-item">
                      {startingDate}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayStreams
