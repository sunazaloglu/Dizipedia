// tv maze ' in api type lari yazdigim kisim

export const TVMAZE_BASE_URL = "https://api.tvmaze.com";

export interface Show {
  id: number;
  name: string;
  summary?: string | null;
  rating?: { average: number | null } | null;
  status?: string | null;
  language?: string | null;
  image?: { medium?: string | null; original?: string | null } | null;
}

export interface SearchResult {
  score: number;
  show: Show;
}

export interface Season {
  id: number;
  number: number | null;
  episodeOrder?: number | null;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
}

export interface ShowWithEmbeds extends Show {
  _embedded?: {
    seasons?: Season[];
    episodes?: Episode[];
  };
}

//generic kullanmamin sebebi API’den farkli endpointlerden farkli tipler donebiliyor
//  genericle tek bir http fonksiyonuyla tum bu tipleri guvenli sekilde yakalayabiliyorum.
//  Generic olmasaydi ya any kullanmak zorunda kalirdim ya da her tip icin ayri fetch yazmak zorunda kalirdim
//   bu  da gereksiz kod tekrari demek.

async function http<T>(path: string): Promise<T> {
  const response = await fetch(`${TVMAZE_BASE_URL}${path}`);

  // eger burda response degeri true ise devam et degilse error mesaji firlat (throw)

  // status burda http nin durum kodu digeri de yazisi.
  //  amac kullaniciya hata alirsa neyle karsilastigini bilmesini istiyor olmam (kullanici dostu olmasi icin).
  if (!response.ok) {
    throw new Error(
      `TVMaze request failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

// burda limiti 30 a esitledim cunku her sayfada 3o adet film gorunmesini istiyorum her 30 da bir slice'licak
//Landing page’de sinirli sayida dizi göster

export async function getShowForLanding(limit: number = 30): Promise<Show[]> {
  const allFromFirstPage = await http<Show[]>("/shows?page=0");
  return allFromFirstPage.slice(0, Math.max(0, limit));
}


//Kullanicinin aradigi dizi isimlerini getir dizi arama
export async function searchShows(query: string): Promise<SearchResult[]> {
  //eger bos stringse bos array dondur degilse fazla bosluklari sil
  if (!query.trim()) return [];
  return http<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}
  
  `);
  //url uyumu encodeURIComponent
  //https://api.tvmaze.com/search/shows?q=QUERY
}

//Bir dizinin tum detaylarini sezonlarini bolumlerini getir
export async function getShowDetailWithEmbeds(
  showId: number
): Promise<ShowWithEmbeds> {

  return http<ShowWithEmbeds>(
    `/shows/${showId}?embed[]=seasons&embed[]=episodes`
  );
}
//https://api.tvmaze.com/shows/1?embed[]=seasons&embed[]=episodes