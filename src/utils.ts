export function makeImgPath(id: string, format?: string) {
  if (id) return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
  else return process.env.PUBLIC_URL + "/assets/no-photo.png";
}
