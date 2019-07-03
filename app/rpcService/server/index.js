import { omniMethod,aiMethod } from './contect';
import { categories } from '../datas'

function objToArray(obj) {
    return obj ? Object.values(obj) : obj;
}

export function omni_listProperties(rpcRequestService) {
    return rpcRequestService(omniMethod.listproperties);
}

/** 
 * @param {*} rpcRequestService 
 * @param {	number	required	the identifier of the tokens or property} propertyid 
 */
export function omni_getProperty(rpcRequestService, params) {
    return rpcRequestService(omniMethod.getproperty, objToArray(params));
}

export function omni_getInfo(rpcRequestService) {
    return rpcRequestService(omniMethod.getinfo);
}

export function omni_getWalletBalances(rpcRequestService) {
    return rpcRequestService(omniMethod.getwalletbalances);
}

export function omni_getWalletAddressBalances(rpcRequestService) {
    return rpcRequestService(omniMethod.getwalletaddressbalances);
}
/**
 * @param {	string	required	the hash of the transaction to lookup} txid
*/
export function omni_getTransaction(rpcRequestService, params) {
    return rpcRequestService(omniMethod.gettransaction, objToArray(params));
}
/**
 * 
 * @param {	string	optional	address filter (default: "*")} txid
 * @param {	number	optional	show at most n transactions (default: 10)} count
 * @param {	number	optional	skip the first n transactions (default: 0)} skip
 * @param {	number	optional	first block to begin the search (default: 0)} startblock
 * @param {	number	optional	last block to include in the search (default: 999999999)} endblock
 */
export function omni_listTransactions(rpcRequestService, params) {
    return rpcRequestService(omniMethod.listtransactions, objToArray(params));
}

export function omni_getTradeHistoryForPair(rpcRequestService, params) {
    return rpcRequestService(omniMethod.gettradehistoryforpair, objToArray(params));
}
/** 
 * @param {	string	required	address to retrieve history for} address
 * @param {	number	optional	number of orders to retrieve (default: 10)} count
 * @param {	number	optional	filter by propertyid transacted (default: no filter)} propertyid
*/
export function omni_getTradeHistoryForAddress(rpcRequestService, params) {
    return rpcRequestService(omniMethod.gettradehistoryforaddress, objToArray(params));
}

/**
 * @param {	string	required	the address to send from} fromaddress
 * @param {	string	required	the address of the receiver} toaddress
 * @param {	number	required	the identifier of the tokens to send} propertyid
 * @param {	string	required	the amount to send} amount
 * @param {	string	optional	an address that can spend the transaction dust (sender by default)} redeemaddress
 * @param {	string	optional	a bitcoin amount that is sent to the receiver (minimal by default)} referenceamount
*/
export function omni_send(rpcRequestService, params) {

    return rpcRequestService(omniMethod.send, objToArray(params));
}
/** 
 * @param {	string	required	the address to send from} fromaddress
 * @param {	number	required	the ecosystem to create the tokens in (1 for main ecosystem, 2 for test ecosystem)} ecosystem
 * @param {	number	required	the type of the tokens to create: (1 for indivisible tokens, 2 for divisible tokens)} type
 * @param {	number	required	an identifier of a predecessor token (0 for new tokens)} previousid
 * @param {	string	required	a category for the new tokens (can be "")} category
 * @param {	string	required	a subcategory for the new tokens (can be "")} subcategory
 * @param {	string	required	the name of the new tokens to create} name
 * @param {	string	required	an URL for further information about the new tokens (can be "")} url
 * @param {	string	required	a description for the new tokens (can be "")} data
 * @param {	string	required	the number of tokens to create }  amount
 */
export function omni_sendIssuanceFixed(rpcRequestService, params) {
    return rpcRequestService(omniMethod.sendissuancefixed, objToArray(params));
}

/**
 * @param {	string	required	the address to send from} fromaddress
* @param {	number	required	the ecosystem to create the tokens in (1 for main ecosystem, 2 for test ecosystem)} ecosystem
* @param {	number	required	the type of the tokens to create: (1 for indivisible tokens, 2 for divisible tokens)} type
* @param {	number	required	an identifier of a predecessor token (0 for new tokens)} previousid
* @param {	string	required	a category for the new tokens (can be "")} category
* @param {	string	required	a subcategory for the new tokens (can be "")} subcategory
* @param {	string	required	the name of the new tokens to create} name
* @param {	string	required	an URL for further information about the new tokens (can be "")} url
* @param {	string	required	a description for the new tokens (can be "")} data
 */
export function omni_sendIssuanceManaged(rpcRequestService, params) {
    return rpcRequestService(omniMethod.sendissuancemanaged, objToArray(params));
}
/**
 * @param {	string	required	the address associated with the tokens} fromaddress
 * @param {	string	required	the address to transfer administrative control to} toaddress
 * @param {	number	required	the identifier of the tokens} propertyid
 */
export function omni_sendChangeIssuer(rpcRequestService, params) {
    return rpcRequestService(omniMethod.sendchangeissuer, objToArray(params));
}

/**
 * @param {	string	required	the address to send from} fromaddress
 * @param {	string	required	the receiver of the tokens (sender by default, can be "")} toaddress
 * @param {	number	required	the identifier of the tokens to grant} propertyid
 * @param {	string	required	the amount of tokens to create} amount
 * @param {	string	optional	a text note attached to this transaction (none by default)} memo
 */
export function omni_sendGrant(rpcRequestService, params) {
    return rpcRequestService(omniMethod.sendgrant, objToArray(params));
}

/**
 * 
 * @param {	string	required	the address to send from} fromaddress
 * @param {	number	required	the identifier of the tokens to revoke} propertyid
 * @param {	string	required	the amount of tokens to revoke} amount
 * @param {	string	optional	a text note attached to this transaction (none by default)}  memo
 */
export function omni_sendRevoke(rpcRequestService, params) {
    return rpcRequestService(omniMethod.sendrevoke, objToArray(params));
}

/**
 * 
 * @param {	string	required	the address to send from} fromaddress
 *@param {	number	required	the ecosystem to create the tokens in (1 for main ecosystem, 2 for test ecosystem)} ecosystem
 *@param {	number	required	the type of the tokens to create: (1 for indivisible tokens, 2 for divisible tokens)} type
 *@param {	number	required	an identifier of a predecessor token (0 for new crowdsales)} previousid
 *@param {	string	required	a category for the new tokens (can be "")} category
 *@param {	string	required	a subcategory for the new tokens (can be "")} subcategory
 *@param {	string	required	the name of the new tokens to create} name
 *@param {	string	required	an URL for further information about the new tokens (can be "")} url
 *@param {	string	required	a description for the new tokens (can be "")} data
 *@param {	number	required	the identifier of a token eligible to participate in the crowdsale} propertyiddesired
 *@param {	string	required	the amount of tokens granted per unit invested in the crowdsale} tokensperunit
 *@param {	number	required	the deadline of the crowdsale as Unix timestamp} deadline
 *@param {	number	required	an early bird bonus for participants in percent per week} earlybonus
 *@param {  number	required	a percentage of tokens that will be granted to the issuer} issuerpercentage
 */
export function omni_sendIssuanceCrowdsale(rpcRequestService, params) {
    return rpcRequestService(omniMethod.sendissuancecrowdsale, objToArray(params));
}

/**
 * 
 * @param {*} rpcRequestService 
 * @param {*} params 
 */
export function omni_getActiveCrowdsales(rpcRequestService){
    return rpcRequestService(omniMethod.getactivecrowdsales)
}

export function omni_getCrowdsale(rpcRequestService,params){
    return rpcRequestService(omniMethod.getcrowdsale,objToArray(params));
}

/**
 * @param {	string	required	the address to trade with} fromaddress
 * @param {	number	required	the identifier of the tokens listed for sale} propertyidforsale
 * @param {	string	required	the amount of tokens to listed for sale} amountforsale
 * @param {	number	required	the identifier of the tokens desired in exchange} propertiddesired
 * @param {	string	required	the amount of tokens desired in exchange} amountdesired 
 */
export function omni_sendtrade(rpcRequestService,params){
    return rpcRequestService(omniMethod.sendtrade,objToArray(params));
}

/**
 * @param {	string	required	the address associated with the crowdsale to close} fromaddress
 * @param {	number	required	the identifier of the crowdsale to close} propertyid 
 */
export function omni_sendCloseCrowdsale(rpcRequestService,params){
    return rpcRequestService(omniMethod.sendclosecrowdsale,objToArray(params));
}

/**
 * @param {	string	required	the address to trade with } fromaddress
 * @param {	number	required	the identifier of the tokens listed for sale } propertyidforsale
 * @param {	number	required	the identifier of the tokens desired in exchange } propertiddesired
 */
export function omni_sendCancelTradesByPair(rpcRequestService,params){
    return rpcRequestService(omniMethod.sendcanceltradesbypair,objToArray(params));
}

/** 
 *@param {	string	required	the hash of the order to lookup } txid
 */
export function omni_getTrade(rpcRequestService,params){
    return rpcRequestService(omniMethod.gettrade,objToArray(params));
}

export function omni_getCategories() {
    return categories;
}


export function ai_sendtoaddress(rpcRequestService,params){
    return rpcRequestService(aiMethod.aisendtoaddress,objToArray(params));
}

