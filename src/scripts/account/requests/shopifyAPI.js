const shopifyRootURL = () => {
  const theme = window.theme || {};
  const routes = theme.routes || {};


  return routes.rootUrl === '/' ? routes.rootUrl : `${routes.rootUrl}/`;
};

export const shopifyLoginRequestURL = () => {
  return `${shopifyRootURL()}account/login`;
};

export const shopifyRegisterRequestURL = () => {
  return `${shopifyRootURL()}account`;
};

export const shopifyRecoverRequestURL = () => {
  return `${shopifyRootURL()}account/recover`;
};
