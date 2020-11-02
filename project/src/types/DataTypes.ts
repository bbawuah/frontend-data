export type dirtyDataArrayType = [string, string][]
export type dirtyDataType = [string, string]
export type formattedDataArayType = [string, number][]

export enum PaymentMethods {
  VPAY = 'VPAY',
  CREDITCARD = 'CREDITCARD',
  CASH = 'CASH',
  MAESTRO = 'MAESTRO',
  PIN = 'PIN',
  CHIPKNIP = 'CHIPKNIP',
  COINS = 'COINS',
  BETAALAUTOMAAT = 'BETAALAUTOMAAT',
  POS = 'POS',
  CHIP = 'CHIP',
  BELPARKEREN = 'BELPARKEREN',
  BANKNOTES = 'BANKNOTES',
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  MOBIEL = 'MOBIEL',
  AMEX = 'AMEX',
  DIP_TAP_GO = 'DIP-TAP&GO',
  DIP_GO = 'DIP_GO',
  XXIMIO = 'XXIMIO',
  DINERS_CLUB = 'DINERS_CLUB'
}

export interface AreaType {
  areaid: string
  areamanagerid: string
  paymentatexit: string
  paymentatpaystation: string
  paymentmethod: string
  startdate: string
}
