import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory } from "../..";

const MANGASYURI_DOMAIN = "https://mangasyuri.net";

export const MangasYuriInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangás Yuri",
	description: "Extension that pulls manga from mangasyuri.net",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGASYURI_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Portuguese",
			type: TagType.GREY,
		},
	],
};

export class MangasYuri extends Mmrcms {
	baseUrl: string = MANGASYURI_DOMAIN;
	languageCode: LanguageCode = LanguageCode.PORTUGUESE;
	sourceTraversalPathName: string = "manga";
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Ação" },
		{ id: "2", name: "Aventura" },
		{ id: "3", name: "Comédia" },
		{ id: "4", name: "Doujinshi" },
		{ id: "5", name: "Drama" },
		{ id: "6", name: "Ecchi" },
		{ id: "7", name: "Fantasia" },
		{ id: "8", name: "Gênero Trocado" },
		{ id: "9", name: "Harém" },
		{ id: "10", name: "Histórico" },
		{ id: "11", name: "Horror" },
		{ id: "12", name: "Josei" },
		{ id: "13", name: "Artes Marciais" },
		{ id: "14", name: "Maduro" },
		{ id: "15", name: "Robô" },
		{ id: "16", name: "Mistério" },
		{ id: "17", name: "One Shot" },
		{ id: "18", name: "Psicológico" },
		{ id: "19", name: "Romance" },
		{ id: "20", name: "Vida Escolar" },
		{ id: "21", name: "Sci-fi" },
		{ id: "22", name: "Seinen" },
		{ id: "23", name: "Shoujo" },
		{ id: "24", name: "Shoujo Ai" },
		{ id: "25", name: "Cotidiano" },
		{ id: "26", name: "Esportes" },
		{ id: "27", name: "Sobrenatural" },
		{ id: "28", name: "Tragédia" },
		{ id: "29", name: "Yuri" },
		{ id: "30", name: "Adulto" },
		{ id: "31", name: "Shounen" },
	];
}
