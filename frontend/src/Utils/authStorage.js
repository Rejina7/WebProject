export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user, rememberMe) => {
  const serializedUser = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem("user", serializedUser);
    sessionStorage.removeItem("user");
  } else {
    sessionStorage.setItem("user", serializedUser);
    localStorage.removeItem("user");
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
};

export const updateStoredUser = (partialUser) => {
  const localUser = localStorage.getItem("user");
  const sessionUser = sessionStorage.getItem("user");
  const storage = localUser ? localStorage : sessionUser ? sessionStorage : null;

  if (!storage) return null;

  try {
    const current = JSON.parse(storage.getItem("user") || "{}");
    const next = { ...current, ...partialUser };
    storage.setItem("user", JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
};

export const getRememberedCredentials = (username) => {
  try {
    const allCreds = localStorage.getItem("rememberedCredentials");
    if (!allCreds) return null;
    
    const credsObj = JSON.parse(allCreds);
    return credsObj[username] || null;
  } catch {
    return null;
  }
};

export const setRememberedCredentials = (username, password) => {
  try {
    const allCreds = localStorage.getItem("rememberedCredentials") || "{}";
    const credsObj = JSON.parse(allCreds);
    credsObj[username] = { username, password };
    localStorage.setItem("rememberedCredentials", JSON.stringify(credsObj));
  } catch {
    console.error("Failed to save remembered credentials");
  }
};

export const clearRememberedCredentials = (username) => {
  try {
    const allCreds = localStorage.getItem("rememberedCredentials") || "{}";
    const credsObj = JSON.parse(allCreds);
    delete credsObj[username];
    localStorage.setItem("rememberedCredentials", JSON.stringify(credsObj));
  } catch {
    console.error("Failed to clear remembered credentials");
  }
};
