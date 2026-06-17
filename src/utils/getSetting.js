export const isMenuVisible = (settings, code) => {
  const setting = settings.find(
    s => s?.StgCode?.trim().toUpperCase() === code?.trim().toUpperCase()
  );
  //console.log(`Checking for menus: ${code}`, setting);
  return setting?.StgValue?.trim().toUpperCase() === 'YES';
};
