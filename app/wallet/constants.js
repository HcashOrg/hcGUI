// Constants copied from hcd/chaincfg/params.go

export const TestNetParams = {
  TicketMaturity:          16,
  TicketExpiry:            6144, // 6*TicketPoolSize
  CoinbaseMaturity:        16,
  SStxChangeMaturity:      1,
  HDCoinType:171,
  Url:"http://testnet-explorer.h.cash/",

  TreasuryAddress: "ScuQxvveKGfpG1ypt6u27F99Anf7EW3cqhq",
};

export const MainNetParams = {
  TicketMaturity:          256,
  TicketExpiry:            40960, // 5*TicketPoolSize
  CoinbaseMaturity:        256,
  SStxChangeMaturity:      1,
  HDCoinType:171,
  Url:"http://hc-explorer.h.cash/",

  TreasuryAddress: "ScuQxvveKGfpG1ypt6u27F99Anf7EW3cqhq",
};
