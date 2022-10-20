export const ConstPattern = { // Ne pas oublier le ^ pour faire la négation du pattern
    onlyAlpha: '[^a-zA-Z]',
    onlyAlphaNum: '[^a-zA-Z0-9]',
    onlyAlphaNumUnderscore: '[^a-zA-Z0-9\_]',
    onlyAlphaSpace: '[^a-zA-Z ]',
    onlyAlphaNumSpace: '[^a-zA-Z0-9 ]',
    email: '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' +
      '\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
    dateFormat: '^([0-2][0-9]|(3)[0-1])(\\/)(((0)[0-9])|((1)[0-2]))(\\/)\\d{4}$', // DD/MM/YYYY
    dateMonthFormat: '^([0-2][0-9]|(3)[0-1])(\\/)(((0)[0-9])|((1)[0-2]))$', // DD/MM
    onlyNum: '[^0-9]',
    onlyNumAndSlash: '[^0-9\/]',
    onlyNumAndLess: '[^0-9\-]',
    onlyFloat: '[^0-9\,]',
    telephoneFr: '^(0[1-9])([0-9]{2}){4}',
    codeNaf: '^\\d{4}[A-Z]$'
  };
  