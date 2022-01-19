function createLicenseKey(params) {
	params = Object.assign({}, params);
	if (params.deviceSerialNumber)
	    params.key = params.deviceSerialNumber;
	if (params.deviceNumber)
	    params.ppk_num = params.deviceNumber;
    if (!params.hasOwnProperty('ppk_num') || !params.hasOwnProperty('key'))
        throw new Error('Ppk number and serial number are needed!');
    if (typeof params.ppk_num !== 'number')
        throw new Error('Ppk number must be an integer!');
    if (typeof params.key !== 'number')
        throw new Error('Serial number must be an integer!');
    // if (params.ppk_num > 65535)
    //     throw new Error('Ppk number must be less then 65535');
    // if (params.key > 65535)
    //     throw new Error('Serial number must be less then 65535');


    //ppk number and serial in hex-string format 00 00
    let ppk_num = _pad(params.ppk_num.toString(16), 4);
    let key = _pad(params.key.toString(16), 4);

    //bytes match numbers in string format 00
    let ppk_num_first_byte_str = ppk_num.substring(0, 2);
    let ppk_num_second_byte_str = ppk_num.substring(2, 4);
    let key_first_byte_str = key.substring(0, 2);
    let key_second_byte_str = key.substring(2, 4);

    //bytes match numbers in numeric format
    let ppk_num_first_byte = parseInt(ppk_num_first_byte_str, 16);
    let ppk_num_second_byte = parseInt(ppk_num_second_byte_str, 16);
    let key_first_byte = parseInt(key_first_byte_str, 16);
    let key_second_byte = parseInt(key_second_byte_str, 16);

    //a string created from asci-characters corresponding to the bytes of the ppk number and the key
    let numKeyString = String.fromCharCode(ppk_num_first_byte) + String.fromCharCode(ppk_num_second_byte) + String.fromCharCode(key_first_byte) + String.fromCharCode(key_second_byte);
    //checksum based on the previous line
    let dchecksum = _GetDChecksum(numKeyString);
    //checksum from checksum)
    let checksum = _GetChecksum(dchecksum + numKeyString);
    checksum = _pad(checksum, 4);
    //bytes from checksum in string format
    let checksum_first_byte_str = checksum.substring(0, 2);
    let checksum_second_byte_str = checksum.substring(2, 4);
    //bytes from checksum in numeric format
    let checksum_first_byte = parseInt(checksum_first_byte_str, 16);
    let checksum_second_byte = parseInt(checksum_second_byte_str, 16);
    //a string created from asci-characters corresponding to /bytes from checksum, device number and serial number
    let rawLicenseString = String.fromCharCode(checksum_first_byte) + String.fromCharCode(checksum_second_byte) + numKeyString;
    //the resulting string is encoded
    let encodedLicenseString = _encode(rawLicenseString);
    //an array is returned, from the numeric representations of the characters of the encoded string
    let licenseArray = [];
    for (let i = 0; i < encodedLicenseString.length; i++)
        licenseArray.push(encodedLicenseString.charCodeAt(i));

    return licenseArray;

    /* helpers */
    function _pad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function _GetChecksum(s) {
        let left, right, sum, i;
        left = 0x0056;
        right = 0x00AF;
        for (i = 0; i < (s.length); i++) {
            right += s.charCodeAt(i);
            if (right > 0x00FF) right -= 0x00FF;
            left += right;
            if (left > 0x00FF) left -= 0x00FF;
        }
        sum = (left << 8) + right;
        return sum.toString(16);
    }

    function _GetDChecksum(s) {
        let left, right, sum, i;
        left = 0x0056;
        right = 0x00AF;
        for (i = 0; i < (s.length); i++) {
            right += s.charCodeAt(i);
            if (right > 0x00FF) right -= 0x00FF;
            left += right;
            if (left > 0x00FF) left -= 0x00FF;
        }
        sum = (left << 8) + right;
        return sum.toString(10);
    }

    function _encode(str) { //mobile parcel coding
        let n = '5169304806665065381231661576';
        let b = -1;
        let a;
        let decode_str = '';
        for (a = 0; a < (str.length); a++) {
            b++;
            if (b == (n.length - 1)) b = 0;
            decode_str += String.fromCharCode(str.charCodeAt(a) + parseInt(n.charAt(b)));
        }
        return decode_str;
    }

}

module.exports = createLicenseKey;