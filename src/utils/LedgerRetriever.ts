import ledger_1 from "../mocks/ledgger_1.json";
import ledger_2 from "../mocks/ledgger_2.json";
import ledger_3 from "../mocks/ledgger_3.json";
import ledger_4 from "../mocks/ledgger_4.json";
import ledger_5 from "../mocks/ledgger_5.json";

export const LedgerRetriever = (prompt: string) => {
  if (
    prompt.includes(
      "For G/L  Account as 204501 with Legal entity  as 0022, can you please query the RDL and show me the transactions with  business transaction ID, BT source system, transaction type, posting record and bt posting direction."
    )
  ) {
    return ledger_1.ledger;
  }
  if (
    prompt.includes(
      "Show the SDA transaction types for the business transactions that have BT source system as SDA, G/L account as 120950 ?"
    )
  ) {
    return ledger_2.ledger;
  }
  if (
    prompt.includes(
      "For BT Source system = SITE, G/L account = 124101, Fetch the accounting events used as per RDL transactions ?"
    )
  ) {
    return ledger_3.ledger;
  }
  if (
    prompt.includes(
      "List down the PR derivation rules which are configured for Btsource system SDAD with SDA Transaction type as 21"
    )
  ) {
    return ledger_4.ledger;
  }
  if (
    prompt.includes(
      "What are the distinct Posting record outputs with respect to the BT Posting direction =C and Acquiring Bank = BANCORP  with SDA Transaction type 21 in PR derivation rule for source system SDAD"
    )
  ) {
    return ledger_5.ledger;
  }
  return null;
};
