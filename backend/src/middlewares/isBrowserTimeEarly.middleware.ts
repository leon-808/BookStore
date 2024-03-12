const getCurrentKST = (): string => {
  const kstOffset = 9 * 60;
  const dateBeforeReplaced = new Date(
    new Date().getTime() + kstOffset * 60000
  ).toISOString();
  return dateBeforeReplaced.slice(0, 19).replace("T", " ");
};

export const isBrowserTimeEarly = (serverTimeString: string): boolean => {
  const browserTime = new Date(getCurrentKST());
  const serverTime = new Date(serverTimeString);
  return browserTime <= serverTime ? true : false;
};
