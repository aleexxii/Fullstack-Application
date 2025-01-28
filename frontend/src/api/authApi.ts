export const loginRequest = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch("http://localhost:7000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login Failed");
  console.log("login response >> ", response);
  return response.json();
};

export const registerRequest = async (userDetails: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch("http://localhost:7000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  });
  if (!response.ok) throw new Error("Registration Failed");
  console.log("register response >>", response);
  return response.json();
};
