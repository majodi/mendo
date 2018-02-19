export function forceUppercase(e: any) {return (''+e.target.value).toUpperCase()}
export function forceCapitalize(e: any) {
    let val = ''+e.target.value
    return (' '+val).charAt(val.length-1) == ' ' ? val.slice(0, val.length-1) + val.charAt(val.length-1).toUpperCase() : val
}

