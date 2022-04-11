import Web3 from "web3";

export function renderEtherValue(input) {
    if (typeof input == "number")
        input = input.toString()
    let inputInEther = Web3.utils.fromWei(input, 'ether')
    if (parseInt(inputInEther) >= 1)
        return inputInEther + " Ether"
    let inputInGwei = Web3.utils.fromWei(input, 'gwei')
    if (parseInt(inputInGwei) >= 1)
        return inputInGwei + " Gwei"
    return input + " Wei"
}