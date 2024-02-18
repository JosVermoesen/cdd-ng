export function NinCheck(
  ninString: string,
  birthYear: number,
  returnFormatted: boolean
) {
  const ninLength = ninString.length;
  if (ninLength !== 11) {
    return 'invalid';
  }

  let ninToCheck = ninString.substring(0, 9);

  if (birthYear < 2000) {
    // nothing
  } else {
    ninToCheck = '2' + ninToCheck;
  }

  let dPip: number;
  let dPip2: number;
  let calcPip: number;

  switch (ninLength) {
    case 11:
      dPip = Number(ninToCheck);
      break;

    default:
      return 'invalid';
  }

  // first check if rekOld is valid
  dPip = Number(ninToCheck);
  dPip2 = Number(ninString.substring(9));
  calcPip = dPip % 97;

  if (ninString.substring(9, 2) === '00') {
    return 'invalid';
  } else if (calcPip === 0 && ninString.substring(9, 2) === '97') {
    // ok
  } else if (calcPip === dPip2) {
    // ok
  } else {
    return 'invalid';
  }

  // then check if sepa version is needed

  if (!returnFormatted) {
    return ninString;
  } else {
    /* rekOld =
      rekOld.substring(0, 3) +
      ' ' +
      rekOld.substring(3, 10) +
      ' ' +
      rekOld.substring(10);
    return rekOld; */
  }
}
