export type GetPlaylistsResponse = {
    items: PlayList[];
  }
  
  export type PlayList = {
    href: string,
    name: string,
  }