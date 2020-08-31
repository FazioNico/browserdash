export const log = (...data: any) => {
  if (window?.location?.href?.includes('localhost')) {
    console.log('[LOG] ', ...data);
  };
}

export const compareValues = (key, order = 'asc') => {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }
    // convert string to uppercase to compar
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];
    // run comparaison
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    // return by order
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

export const getWidgetsAsArray = (widgetsData: Object) => {
  const widgets = [];
  for (const key in widgetsData) {
    if (widgetsData.hasOwnProperty(key)) {
      widgets.push({
        name: key, active: widgetsData[key]
      })
    }
  }
  return widgets;
}