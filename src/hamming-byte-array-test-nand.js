Number.prototype.encodeEven = function(bitsNum) {
	var result = 0;
	for (var i = 0; i < bitsNum; i++) {
		result |= (this & (1 << i)) << i;
	}
	return result;
}

Number.prototype.encodeOdd = function(bitsNum) {
	var result = 0;
	for (var i = 0; i < bitsNum; i++) {
		result |= (this & (1 << i)) << (i + 1);
	}
	return result;
}

Number.prototype.decodeEven = function(bitsNum) {
	var result = 0;
	for (var i = 0; i < bitsNum; i += 2) {
		result |= ((1 << i) & this) >> (i / 2);
	}
	return result;
}

Number.prototype.decodeOdd = function(bitsNum) {
	var result = 0;
	for (var i = 0; i < bitsNum; i += 2) {
		result |= ((1 << (i + 1)) & this) >> (i / 2 + 1);
	}
	return result;
}

Number.prototype.toAlignedBinary = function(bitsNum) {
	var result = this.toString(2);
	while(result.length < bitsNum) { result = '0' + result; }
	return result;
}

function getRedundantBitsNumber(bitsNum) {
	var result = 0;
	while (Math.pow(2, result) < bitsNum) {
		result++;
	}
	return result;
}

function computeParity(startBitIndex, partition, bitsNum, data) {
	var parity = 0;
	while (startBitIndex < bitsNum) {
		for (var i = 0; i < partition; i++) {
			var byteIndex = Math.floor(startBitIndex / 8);
			parity ^= (data[byteIndex] >> (startBitIndex % 8)) & 1;
			startBitIndex++;
		}
		startBitIndex += partition;
	}
	return parity;
}

function computeHammingCode(data) {
	var bitsNum = data.length * 8;
	var odd = 0;
	var even = 0;
	var redundantBitsNum = getRedundantBitsNumber(bitsNum);
	for (var redundantBitIndex = 0; redundantBitIndex < redundantBitsNum; redundantBitIndex++) {
		var partition = Math.pow(2, redundantBitIndex);
		odd |= computeParity(partition, partition, bitsNum, data) << redundantBitIndex;
		even |= computeParity(0, partition, bitsNum, data) << redundantBitIndex;
	}
	
	return odd.encodeOdd(redundantBitsNum) | even.encodeEven(redundantBitsNum);
}

function getErrorbitIndex(validEcc, compareEcc, eccSize) {
	return validEcc.decodeOdd(eccSize) ^ compareEcc.decodeOdd(eccSize);;
}

function isErrorCorrectable(validEcc, compareEcc, eccSize) {
	var maskEven = 0;
	var i = 0;
	while (i++ < eccSize) maskEven |= 1 << i;
	return ((validEcc ^ (validEcc >> 1)) ^ (compareEcc ^ (compareEcc >> 1))) & maskEven === maskEven;
}

const dataValid =  [5,168,8,182,11,93,177,96,227,248,51,128,75,150,206,138,183,128,179,114,254,180,240,56,168,117,14,205,234,239,222,76,50,46,187,26,145,52,213,166,225,204,32,118,190,51,14,93,91,197,88,237,41,175,144,203,173,182,36,42,107,131,129,207,163,250,1,207,232,13,190,246,134,171,109,214,113,68,179,198,219,243,58,21,254,22,254,143,156,162,122,242,101,160,9,53,150,143,57,173,130,34,76,140,218,74,168,8,2,11,145,49,197,84,72,206,146,209,213,190,145,106,250,189,249,38,154,146,146,219,45,83,52,52,128,25,170,146,148,39,214,84,104,85,79,174,99,189,60,10,44,56,10,85,238,132,4,161,168,174,126,97,236,89,63,19,185,12,52,138,50,53,104,48,33,74,127,249,203,203,26,14,112,142,243,85,161,243,244,100,42,178,94,115,229,147,251,222,164,67,172,142,161,74,207,27,34,215,210,237,134,212,18,254,55,145,13,182,212,163,13,178,67,15,111,123,186,190,247,142,125,173,182,65,123,153,25,44,118,57,193,104,139,182,163,162,178,219,173,103,7,91,184,50,244,155];

const dataInvalid = [5,168,8,182,11,93,177,96,227,248,51,128,75,150,206,138,183,128,179,114,254,180,240,56,168,117,14,205,234,239,222,76,50,46,187,26,145,52,213,166,225,204,32,118,190,51,14,93,91,197,88,237,41,175,144,203,173,182,36,42,107,131,129,207,163,250,1,207,232,13,190,246,134,171,109,214,113,68,179,198,219,243,58,21,254,22,254,143,156,162,90,242,101,160,9,53,150,143,57,173,130,34,76,140,218,74,168,8,2,11,145,49,197,84,72,206,146,209,213,190,145,106,250,189,249,38,154,146,146,219,45,83,52,52,128,25,170,146,148,39,214,84,104,85,79,174,99,189,60,10,44,56,10,85,238,132,4,161,168,174,126,97,236,89,63,19,185,12,52,138,50,53,104,48,33,74,127,249,203,203,26,14,112,142,243,85,161,243,244,100,42,178,94,115,229,147,251,222,164,67,172,142,161,74,207,27,34,215,210,237,134,212,18,254,55,145,13,182,212,163,13,178,67,15,111,123,186,190,247,142,125,173,182,65,123,153,25,44,118,57,193,104,139,182,163,162,178,219,173,103,7,91,184,50,244,155];

const bitsNum = dataValid.length * 8;

const redundantBitsNum = getRedundantBitsNumber(bitsNum);
const hammingCodeBitsNumber = redundantBitsNum * 2;
const hammingCodeValid = computeHammingCode(dataValid);
const hammingCodeInvalid = computeHammingCode(dataInvalid);

console.log('Hamming code bits number:', hammingCodeBitsNumber, 'for', dataValid.length, 'bytes');
console.log('Hamming code valid:  ', hammingCodeValid.toAlignedBinary(hammingCodeBitsNumber), ':', hammingCodeValid, hammingCodeValid.toString(16) + 'h');
console.log('Hamming code invalid:', hammingCodeInvalid.toAlignedBinary(hammingCodeBitsNumber), ':', hammingCodeInvalid, hammingCodeInvalid.toString(16) + 'h');

if (hammingCodeValid !== hammingCodeInvalid) {
	if (isErrorCorrectable(hammingCodeValid, hammingCodeInvalid, hammingCodeBitsNumber)) {
		const errorBitIndex = getErrorbitIndex(hammingCodeValid, hammingCodeInvalid, hammingCodeBitsNumber);
		console.log('Error byte index:', Math.floor(errorBitIndex / 8), 'bit index:', errorBitIndex % 8);
	} else {
		console.log('Error is not correctable!');
	}
} else {
	console.log('There is no error');
}



