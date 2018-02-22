export function forceUppercase(value: any) {return (''+value).toUpperCase()}
export function forceCapitalize(value: any) {
    let val = ''+value
    return (' '+val).charAt(val.length-1) == ' ' ? val.slice(0, val.length-1) + val.charAt(val.length-1).toUpperCase() : val
}
