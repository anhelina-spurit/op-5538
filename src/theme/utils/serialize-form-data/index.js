export function serializeFormData(form, deep = false) {
  const formEntries = new FormData(form).entries();

  if (!deep) {
    return Array.from(formEntries).reduce((serializedData, [key, value]) => {
      if (Array.isArray(serializedData[key])) {
        serializedData[key].push(value);
      } else if (Object.prototype.hasOwnProperty.call(serializedData, key)) {
        serializedData[key] = [serializedData[key], value];
      } else {
        serializedData[key] = value;
      }

      return serializedData;
    }, {});
  }

  const keyRegex = /(.*)(\[.*)$/;
  const subKeyRegex = /.*\[(.*)\]$/;

  const formData = Array.from(formEntries).reduce((prev, [x, y]) => {
    let key = x;
    let value = y;

    if (prev[x]) {
      value = [prev[x], y];
    } else if (keyRegex.exec(x)) {
      key = keyRegex.exec(x)[1];

      const subKey = subKeyRegex.exec(x)[1];

      if (prev[key]) {
        value = {
          ...prev[key],
          [subKey]: y,
        };
      } else {
        value = {
          [subKey]: y,
        };
      }
    }

    return {
      ...prev,
      [key]: value,
    };
  }, {});

  return formData;
}
