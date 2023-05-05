"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detectPatterns = function (name) {
    var patterns = new Set();
    var nameFirst = name.split('.bit')[0];
    // check start with 0
    var start0Pattern = checkStarWith0(nameFirst);
    if (start0Pattern) {
        if (Array.isArray(start0Pattern)) {
            start0Pattern.map(function (item) {
                patterns.add(item);
            });
        }
        else {
            patterns.add(start0Pattern);
        }
    }
    // check end with 0
    var end0Pattern = checkEndWith0(nameFirst);
    if (end0Pattern) {
        patterns.add(end0Pattern);
    }
    // check length
    var lengthPattern = checkAccountLen(nameFirst);
    if (lengthPattern) {
        patterns.add(lengthPattern);
    }
    // check like date
    var dateLikePattern = checkLikeDate(nameFirst);
    if (dateLikePattern) {
        patterns.add(dateLikePattern);
    }
    // check repeat
    var repeatPattern = checkRepeatPattern(nameFirst);
    if (repeatPattern) {
        patterns.add(repeatPattern);
    }
    return patterns;
};
// check num length
var checkAccountLen = function (name) {
    var length = name.length;
    if (Number(length) < 4) {
        return '999';
    }
    else if (length >= 4 && length < 5) {
        return '10K';
    }
    else if (length >= 5 && length < 6) {
        return '100K';
    }
    else {
        return '';
    }
};
// check like date
var checkLikeDate = function (name) {
    var reg = /^(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/;
    if (reg.test(name)) {
        return 'MMDD';
    }
    else {
        return '';
    }
};
// check end with 0
var checkEndWith0 = function (name) {
    var revertName = name.split('').reverse().join('');
    var flag = true;
    var nameArray = revertName.split('');
    var result = '';
    var reg = /^0/;
    if (reg.test(revertName)) {
        nameArray.map(function (item) {
            if (item === '0' && flag) {
                result += '0';
            }
            else {
                flag = false;
                result += 'X';
            }
        });
        result = result.split('').reverse().join('');
        return result;
    }
    else {
        return result;
    }
};
// check start with 0
var checkStarWith0 = function (name) {
    var reg = /^0/;
    var result = '';
    if (reg.test(name)) {
        // check 0x start
        var reg0x = /^0x/;
        if (reg0x.test(name)) {
            // check length
            var split0xName = name.slice(2);
            var lengthPattern = checkAccountLen(split0xName);
            if (lengthPattern) {
                return "0x".concat(lengthPattern);
            }
            else {
                return result;
            }
        }
        else {
            var patternArray_1 = [];
            var flag_1 = true;
            var nameArray_1 = name.split('');
            nameArray_1.map(function (item, index) {
                if (item === '0' && flag_1) {
                    var resultArr = nameArray_1.map(function (item, indexFilter) {
                        if (indexFilter <= index) {
                            return '0';
                        }
                        else {
                            return 'X';
                        }
                    });
                    patternArray_1.push(resultArr.join(''));
                }
                else {
                    flag_1 = false;
                }
            });
            return patternArray_1;
        }
    }
    else {
        return result;
    }
};
// check repeat pattern
var checkRepeatPattern = function (name) {
    var result = 'A';
    for (var i = 1; i < name.length; i++) {
        var current = name[i];
        var pre = name[i - 1];
        var resultLen = result.length;
        var resultCharCode = result[resultLen - 1].charCodeAt(0);
        if (current === pre) {
            result += String.fromCharCode(resultCharCode);
        }
        else {
            if (resultCharCode < 68) {
                var beforStr = name.slice(0, i);
                if (beforStr.indexOf(current) !== -1) {
                    result += result[beforStr.indexOf(current)];
                }
                else {
                    result += String.fromCharCode(resultCharCode + 1);
                }
            }
            else {
                result = '';
                break;
            }
        }
    }
    return result;
};
exports.default = detectPatterns;
