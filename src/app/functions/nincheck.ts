export function NinCheck(
  ninString: string,
  birthYear: number,
  gender: string,
  returnText: 'Formatted' | 'ExtendedInfo' | 'NinOnly'
): string {
  const ninLength = ninString.length;
  let stringToReturn = '';
  if (ninLength !== 11) {
    return 'invalid: should be 11 characters long';
  } else {
    let ninToCheck = ninString.substring(0, 9);
    if (birthYear < 2000) {
    } else {
      ninToCheck = '2' + ninToCheck;
    }

    let dPip: number;
    let dPip2: number;
    let dPip3: number;
    let calcPip: number;

    dPip = Number(ninToCheck);
    dPip2 = Number(ninString.substring(9));
    dPip3 = Number(ninString.substring(6, 9));
    if (dPip3 & 1) {
      // ODD
      gender = 'M';
    } else {
      // EVEN
      gender = 'F';
    }
    calcPip = dPip % 97;
    // console.log(dPip, dPip2, calcPip, 97 - calcPip);

    // check if the pip is correct
    if (97 - calcPip === dPip2) {
      // ok
      switch (returnText) {
        case 'NinOnly':
          stringToReturn = ninString;
          break;

        case 'Formatted':
          // TODO
          stringToReturn = ninString;
          break;

        case 'ExtendedInfo':
          console.log(dPip3);
          if (gender === 'M') {
            stringToReturn =
              (dPip3 + 1) / 2 + 'th MALE born on that day: ' + ninString;
          } else {
            if (gender === 'F') {
              stringToReturn = 'FEMALE: ' + ninString;
            }
          }          
          break;
      }
      return stringToReturn;
    }
    return 'invalid?'; // Add this return statement to fix the problem
  }
}
