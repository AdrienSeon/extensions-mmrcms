import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory, SourceTag } from "../..";

export const LeoMangaInfo: SourceInfo = {
	version: "1.0.0",
	name: "LeoManga",
	description: "Extension that pulls manga from leomanga.me",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://leomanga.me",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Spanish",
			type: TagType.GREY,
        },
        {
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class LeoManga extends Mmrcms {
    name: string = LeoMangaInfo.name;
	baseUrl: string = LeoMangaInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.SPANISH;
    latestIsInListFormat: boolean = false;
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Accion" },
		{ id: "2", name: "Aventura" },
		{ id: "3", name: "Comedia" },
		{ id: "4", name: "Doujinshi" },
		{ id: "5", name: "Drama" },
		{ id: "6", name: "Ecchi" },
		{ id: "7", name: "Fantasia" },
		{ id: "8", name: "Gender Bender" },
		{ id: "9", name: "Harem" },
		{ id: "10", name: "Historico" },
		{ id: "11", name: "Horror" },
		{ id: "12", name: "Josei" },
		{ id: "13", name: "Artes Marciales" },
		{ id: "14", name: "Madura" },
		{ id: "15", name: "Mecha" },
		{ id: "16", name: "Misterio" },
		{ id: "17", name: "One Shot" },
		{ id: "18", name: "Psicológico" },
		{ id: "19", name: "Romance" },
		{ id: "20", name: "Vida Cotidiana" },
		{ id: "21", name: "Sci-fi" },
		{ id: "22", name: "Seinen" },
		{ id: "23", name: "Shoujo" },
		{ id: "24", name: "Shoujo Ai" },
		{ id: "25", name: "Shounen" },
		{ id: "26", name: "Shounen Ai" },
		{ id: "27", name: "Slice of Life" },
		{ id: "28", name: "Supernatural" },
		{ id: "29", name: "Tragedia" },
		{ id: "30", name: "Yaoi" },
		{ id: "31", name: "Yuri" },
		{ id: "32", name: "Deporte" },
		{ id: "33", name: "Thriller" },
		{ id: "34", name: "Vida Escolar" },
		{ id: "35", name: "Boys Love" },
		{ id: "36", name: "Girls Love" },
		{ id: "37", name: "Gore" },
		{ id: "38", name: "Hentai" },
		{ id: "39", name: "Magia" },
		{ id: "40", name: "Manwha" },
		{ id: "41", name: "Policial" },
		{ id: "42", name: "Realidad Virtual" },
		{ id: "43", name: "Super Poderes" },
		{ id: "44", name: "Suspense" },
		{ id: "45", name: "Supervivencia" },
		{ id: "46", name: "Parodia" },
		{ id: "47", name: "Demonios" },
		{ id: "48", name: "Escolar" },
	];
	sourceTags: SourceTag[] = [
		{ id: "freaking-romance", name: "Freaking Romance" },
		{ id: "love-lucky", name: "Love Lucky" },
		{ id: "lust-awakening", name: "Lust Awakening" },
		{ id: "despertar-de-la-lujuria", name: "Despertar de la lujuria" },
		{ id: "inazumaelevenaresnotenbin", name: "inazumaelevenaresnotenbin" },
		{ id: "heir-of-the-penguins", name: "Heir of the Penguins" },
		{ id: "amor", name: "amor" },
		{ id: "drama", name: "drama" },
		{ id: "mysteries", name: "mysteries" },
		{ id: "anal", name: "anal" },
		{ id: "bukkake", name: "bukkake" },
		{ id: "doble-penetracion", name: "doble penetracion" },
		{ id: "orgia", name: "orgia" },
		{ id: "blow-job", name: "blow job" },
		{ id: "big-breasts", name: "big breasts" },
		{ id: "incesto", name: "incesto" },
		{ id: "milf", name: "milf" },
		{ id: "prenadas", name: "preñadas" },
		{ id: "slave-sex", name: "slave sex" },
		{ id: "lolicon", name: "lolicon" },
		{ id: "nurse", name: "nurse" },
		{ id: "reality", name: "Reality" },
		{ id: "glitch", name: "Glitch" },
		{ id: "glitcher", name: "Glitcher" },
		{ id: "horror", name: "Horror" },
		{ id: "suspenso", name: "Suspenso" },
		{ id: "realidad", name: "Realidad" },
		{ id: "slider", name: "Slider" },
		{ id: "novela", name: "Novela" },
		{ id: "sobrenatural", name: "Sobrenatural" },
		{ id: "tragedia", name: "Tragedia" },
		{ id: "error", name: "Error" },
		{ id: "psicologico", name: "Psicologico" },
		{ id: "sufrimiento", name: "Sufrimiento" },
		{ id: "visual", name: "Visual" },
		{ id: "narrativo", name: "Narrativo" },
		{ id: "shotacon", name: "shotacon" },
		{ id: "paizuri", name: "paizuri" },
		{ id: "kemonomimi", name: "kemonomimi" },
		{ id: "mundo-paralelo", name: "mundo paralelo" },
		{ id: "coleccion-hentai", name: "coleccion hentai" },
		{ id: "adultos", name: "adultos" },
	];
}
