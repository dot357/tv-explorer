// helper types 
export type Nullable<T> = T | null;

// Reusable
export interface Country {
  name: string;
  code: string;
  timezone: string;
}

export interface Image {
  medium: string;
  original: string;
}

export interface Rating {
  average: Nullable<number>;
}

export interface Href {
  href: string;
  name?: string; 
}

export interface LinksSelf {
  self: { href: string };
}

// CHannels
interface ChannelBase {
  id: number;
  name: string;
  country?: Nullable<Country>;
  officialSite?: Nullable<string>;
}


export type Network = Omit<ChannelBase, "country"> & { country: Nullable<Country> };


export type WebChannel = ChannelBase;


// People
export interface PersonLinks extends LinksSelf {}

export interface Person {
  id: number;
  url: string;
  name: string;
  country: Nullable<Country>;
  birthday: Nullable<string>;
  deathday: Nullable<string>;
  gender: Nullable<string>;
  image: Nullable<Image>;
  updated: number;
  _links: PersonLinks;
}

export interface CharacterLinks extends LinksSelf {}

export interface Character {
  id: number;
  url: string;
  name: string;
  image: Nullable<Image>;
  _links: CharacterLinks;
}

// Show
export interface ShowLinks extends LinksSelf {
  previousepisode?: Href;
  nextepisode?: Href;
}

export interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: Nullable<number>;
  averageRuntime: Nullable<number>;
  premiered: Nullable<string>;
  ended: Nullable<string>;
  officialSite: Nullable<string>;

  schedule: {
    time: string;
    days: string[];
  };

  rating: Rating;

  weight: number;

  network?: Nullable<Network>;
  webChannel?: Nullable<WebChannel>;

  dvdCountry?: Nullable<string>;

  externals: {
    tvrage?: Nullable<number>;
    thetvdb?: Nullable<number>;
    imdb?: Nullable<string>;
  };

  image?: Nullable<Partial<Image>>; // if returns partials?
  summary: Nullable<string>;
  updated: number;

  _links: ShowLinks;
}


export interface CrewMember {
  type: string;
  person: Person;
}


export interface CastMember {
  person: Person;
  character: Character;
  self: boolean;
  voice: boolean;
}


export interface EpisodeLinks extends LinksSelf {
  show?: Href;
}

export type EpisodeType = "regular" | "special" | string;

export interface Episode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: Nullable<EpisodeType>;
  airdate: Nullable<string>;
  airtime: Nullable<string>;
  airstamp: Nullable<string>;
  runtime: Nullable<number>;
  rating: Rating;
  image: Nullable<Image>;
  summary: Nullable<string>;
  _links: EpisodeLinks;
}


export interface SeasonLinks extends LinksSelf {}

export interface Season {
  id: number;
  url: string;
  number: number;
  name: Nullable<string>;
  episodeOrder: Nullable<number>;
  premiereDate: Nullable<string>;
  endDate: Nullable<string>;
  network: Nullable<Network>;
  webChannel: Nullable<WebChannel>;
  image: Nullable<Image>;
  summary: Nullable<string>;
  _links: SeasonLinks;
}
