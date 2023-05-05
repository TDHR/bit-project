

const detectPatterns = (name: string): Set<string> =>  {
    const patterns: Set<string> = new Set();
    const nameFirst = name.split('.bit')[0];
    // check start with 0
    const start0Pattern = checkStarWith0(nameFirst);
    if(start0Pattern) {
        if(Array.isArray(start0Pattern)) {
            start0Pattern.map((item) => {
                patterns.add(item);
            })
        }else {
            patterns.add(start0Pattern);
        }
    }

    // check end with 0
    const end0Pattern = checkEndWith0(nameFirst);
    if(end0Pattern) {
        patterns.add(end0Pattern);
    }


    // check length
    const lengthPattern = checkAccountLen(nameFirst);
    if(lengthPattern) {
        patterns.add(lengthPattern);
    }
    // check like date
    const dateLikePattern = checkLikeDate(nameFirst);
    if(dateLikePattern) {
        patterns.add(dateLikePattern);
    }

    // check repeat
    const repeatPattern = checkRepeatPattern(nameFirst);
    if(repeatPattern) {
        patterns.add(repeatPattern);
    }

    return patterns;
}

// check num length
const checkAccountLen = (name:string): string => {
    const length = name.length;
    if(Number(length) < 4) {
        return '999';
    }else if (length>= 4 && length < 5) {
        return '10K';
    }else if (length >= 5 && length < 6) {
        return '100K';
    }else {
        return ''
    }
}

// check like date
const checkLikeDate = (name:string): string => {
    const reg = /^(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/;
    if(reg.test(name)) {
        return 'MMDD';
    }else {
        return '';
    }

}
// check end with 0
const checkEndWith0 = (name:string): string => {
    const revertName = name.split('').reverse().join('');
    let flag = true;
    let nameArray = revertName.split('');
    let result = '';
    const reg = /^0/;
    if(reg.test(revertName)) {
        nameArray.map((item) => {
            if(item === '0' && flag) {
                result += '0'
            }else {
                flag = false;
                result += 'X';
            }
        })
        result = result.split('').reverse().join('');
        return result

    }else {
        return result

    }

}
// check start with 0
const checkStarWith0 = (name:string): string | string[] => {
    const reg = /^0/;
    let result = '';
    if(reg.test(name)) {
        // check 0x start
        const reg0x = /^0x/;
        if(reg0x.test(name)) {
            // check length
            let split0xName = name.slice(2);
            const lengthPattern = checkAccountLen(split0xName);
            if(lengthPattern) {
                return `0x${lengthPattern}`;
            }else {
                return result;
            }
        }else {
            let patternArray:string[] = [];
            let flag = true;
            let nameArray = name.split('');
            nameArray.map((item:string,index:number) => {
                if(item === '0' && flag) {
                    let resultArr = nameArray.map((item:string,indexFilter:number) => {
                        if(indexFilter<=index) {
                            return '0'
                        }else {
                            return 'X'
                        }
                    })
                    patternArray.push(resultArr.join(''));
                    
                }else {
                    flag = false;
                }
            })
            return patternArray;
        }
    }else {
        return result;
    }
}

// check repeat pattern
const checkRepeatPattern = (name:string):string => {
    let result = 'A';
    for(let i = 1;i<name.length;i++) {
        let current = name[i];
        let pre = name[i-1];
        let resultLen = result.length;
        let resultCharCode = result[resultLen-1].charCodeAt(0);
        if(current === pre) {
            result += String.fromCharCode(resultCharCode);
        }else {
            if(resultCharCode < 68) {
                let beforStr:string = name.slice(0,i);
                if(beforStr.indexOf(current) !== -1) {
                    result += result[beforStr.indexOf(current)];
                }else {
                    result += String.fromCharCode(resultCharCode + 1);
                }
            }else {
                result = '';
                break;
            }
        }

    }
    return result
}
  
export default detectPatterns;