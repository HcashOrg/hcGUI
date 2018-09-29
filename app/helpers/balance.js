export const UnitEnum= {
    hc:'hc',
    atoms:'atoms'
}
export function atomsToHc(amount,currencyDisplay,unit=UnitEnum.hc){
    if(currencyDisplay.toLowerCase() === unit)  return amount; 

    let hc=0;
    if (typeof amount !== "undefined" && amount !== 0) { 
        hc = parseInt(amount) / 100000000;
    }
    return hc ;
}
export function hcToAtoms(amount,currencyDisplay,unit=UnitEnum.atoms){
    if(currencyDisplay.toLowerCase() === unit) return amount;

    let atoms=0;
    if (typeof amount !== "undefined" && amount !== 0) { 
        atoms = amount * 100000000;
    }
   return atoms
}