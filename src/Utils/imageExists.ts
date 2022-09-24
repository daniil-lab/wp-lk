const imageExists = (image_url: string): boolean => {
  const http = new XMLHttpRequest();

  http.open("HEAD", image_url, false);
  http.send();

  return http.status === 200;
};

export default imageExists;
