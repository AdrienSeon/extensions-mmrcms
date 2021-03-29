import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory, DateFormat } from "../..";

export const SubmangaInfo: SourceInfo = {
	version: "1.0.0",
	name: "Submanga",
	description: "Extension that pulls manga from submanga.io",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://submanga.io",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Spanish",
			type: TagType.GREY,
		},
	],
};

export class Submanga extends Mmrcms {
    name: string = SubmangaInfo.name;
    baseUrl: string = SubmangaInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.SPANISH;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "hoy",
        yesterdayTranslation: "ayer",
    };
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
}
