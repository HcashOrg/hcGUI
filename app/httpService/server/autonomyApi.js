import {get,post} from "../http";


// Return an object to be sent as vote information.
export function Vote(token, ticket, voteBitInt, signature) {
    const voteBit = voteBitInt.toString(16);
    return { token, ticket, voteBit, signature };
}

export const getActiveVotes = (piURL) => get(piURL,`/v1/proposals/activevote`);
export const getVetted = (piURL) => get(piURL,`/v1/proposals/vetted`);
export const getVotesStatus = (piURL) => get(piURL,`/v1/proposals/votestatus`);
export const getProposal = (piURL, token) => get(piURL,`/v1/proposals/${token}`);
export const getProposalVotes = (piURL, token) => get(piURL,`/v1/proposals/${token}/votes`);
export const getProposalVoteStatus = (piURL, token) => get(piURL,`/v1/proposals/${token}/votestatus`);

// votes must be an array of Vote()-produced objects.
export const castVotes = (piURL, votes) => post(piURL,`/v1/proposals/castvotes`, { votes });
