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

  const getStreams = async (publicKey: PublicKey) => {
    const client = new StreamClient(
      RPC_CLUSTER_URL,
      Cluster.Devnet,
      "confirmed"
    )
    const response = await client.get({ wallet: publicKey })

    if (response.length > 0) {
      const result: UserStreams[] = []
      response.forEach((item) => {
        const id = item[0]
        const contract = item[1]
        result.push({ id, contract })
      })
      setStreams(result)
    }
  }

  useEffect(() => {
    if (wallet.connected) {
      // @ts-ignore
      getStreams(wallet.publicKey)
    }
  }, [wallet.connected])

  const checkStatus = (stream: Stream) => {
    const currentTimestamp = Date.now() / 1000
    let status = "Streaming"
    if (stream.canceledAt) {
      status = "Canceled"
    }
    if (currentTimestamp > stream.end) {
      status = "Completed"
    }
    if (currentTimestamp < stream.start) {
      status = "Scheduled"
    }
    return status
  }
  const checkDirection = (stream: Stream) => {
    const direction =
      stream.sender === wallet.publicKey?.toBase58() ? "Outgoing" : "Incoming"
    return direction
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
