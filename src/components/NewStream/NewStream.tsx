import { useState, FC, useEffect } from "react"
import Button from "../UI-elements/Button/Button"
import TextInput from "../UI-elements/TextInput/TextInput"
import "./NewStream.scss"
import NumberInput from "../UI-elements/NumberInput/NumberInput"
import Dropdown from "../UI-elements/Dropdown/Dropdown"
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { StreamClient, getBN, Cluster } from "@streamflow/stream"

interface NewStreamProps {
  setOpenNewStreamForm: (value: boolean) => void
}
interface Tokens {
  mint: string
  amount: number
  decimals: number
  uiAmount: string
  isNative: boolean
}
interface FormState {
  token: Tokens | null
  amount: string
  walletAddress: string
  contractName: string
}

const NewStream: FC<NewStreamProps> = ({ setOpenNewStreamForm }) => {
  const wallet = useWallet()
  const anchorWallet = useAnchorWallet()
  const [loading, setLoading] = useState(false)
  const [transactionSigniture, setTransactionSignature] = useState("")
  const [tokens, setTokens] = useState<Tokens[]>([])
  const [formState, setFormState] = useState<FormState>({
    token: null,
    amount: "0",
    walletAddress: "",
    contractName: "",
  })

  const handleDropdownChange = (selectedToken: string) => {
    const token = tokens.find((token) => token.mint === selectedToken)

    if (token) {
      setFormState({ ...formState, token: token })
    }
  }

  const getTokenAccounts = async () => {
    const solanaConnection = new Connection("https://api.devnet.solana.com")

    const response = await solanaConnection.getParsedTokenAccountsByOwner(
      // @ts-ignore
      wallet.publicKey,
      { programId: TOKEN_PROGRAM_ID }
    )
    const result: Tokens[] = []
    response.value.forEach((value) => {
      const mint = value.account.data.parsed.info.mint
      const isNative = value.account.data.parsed.info.isNative
      const amount = value.account.data.parsed.info.tokenAmount.uiAmount
      const uiAmount = value.account.data.parsed.info.tokenAmount.uiAmountString
      const decimals = value.account.data.parsed.info.tokenAmount.decimals
      if (amount > 0) {
        result.push({ mint, amount, uiAmount, decimals, isNative })
      }
    })
    setTokens(result)
  }

  useEffect(() => {
    if (wallet.connected) {
      getTokenAccounts()
    }
  }, [wallet.connected])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const client = new StreamClient(
      "https://api.devnet.solana.com",
      Cluster.Devnet
    )
    const depositedAmount = getBN(
      Number(formState.amount),
      formState.token?.decimals || 0
    )
    const createStreamParams = {
      sender: anchorWallet,
      recipient: formState.walletAddress,
      mint: formState.token!.mint,
      start: Math.ceil(Date.now() / 1000) + 300,
      depositedAmount,
      period: 60,
      cliff: 0,
      cliffAmount: getBN(0, 9),
      amountPerPeriod: getBN(
        Number(formState.amount),
        formState.token?.decimals || 0
      ),
      name: formState.contractName,
      canTopup: false,
      cancelableBySender: true,
      cancelableByRecipient: true,
      transferableBySender: true,
      transferableByRecipient: false,
      automaticWithdrawal: false,
      withdrawalFrequency: 10,
      isNative: formState.token?.isNative || false,
      partner: null,
    }

    try {
      setLoading(true)
      // @ts-ignore
      const { ixs, tx, metadata } = await client.create(createStreamParams)

      setLoading(false)

      setTransactionSignature(tx)
      console.log("TransactionSignature", tx)

      setOpenNewStreamForm(false)
    } catch (exception) {
      // handle exception
      console.log("exception", exception)
    }
  }

  return (
    <div className="newStream">
      <div className="newStream_content">
        <p className="formTitle">CREATE NEW STREAM</p>
        <form onSubmit={handleSubmit}>
          <Dropdown
            label="Token"
            options={tokens}
            onChange={handleDropdownChange}
          />
          <TextInput
            label="Recipient Wallet Address"
            value={formState.walletAddress}
            onChange={(e) =>
              setFormState({ ...formState, walletAddress: e.target.value })
            }
            placeholder="Please double check the address"
            errorMessage="Wallet address is required"
            error={false}
          />
          <TextInput
            label="Contract Title"
            value={formState.contractName}
            onChange={(e) =>
              setFormState({ ...formState, contractName: e.target.value })
            }
            placeholder="e.g IDE GAS (why not)"
            errorMessage="Contract title is required"
            error={false}
          />
          <NumberInput
            label="Amount"
            value={formState.amount}
            onChange={(e) =>
              setFormState({ ...formState, amount: e.target.value })
            }
            placeholder="e.g 0.001"
            errorMessage="Contract title is required"
            error={false}
          />
          <div className="form-actions">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setOpenNewStreamForm(false)}
            />
            <Button
              disabled={loading}
              label="Create"
              variant={loading ? "disabled" : "primary"}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewStream
