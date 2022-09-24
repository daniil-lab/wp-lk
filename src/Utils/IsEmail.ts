const IsEmail = (email: string): boolean =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

export default IsEmail;
