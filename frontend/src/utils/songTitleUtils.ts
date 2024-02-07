const maxTitleLength = 50; // maximum length of the song title
const ellipsis = "..."; // the ellipsis to add if the title is truncated

export function truncateTitle(title: string) {
  if (title.length > maxTitleLength) {
    return title.slice(0, maxTitleLength) + ellipsis;
  }
  return title;
}
