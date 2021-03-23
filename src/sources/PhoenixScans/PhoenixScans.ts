import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory, SourceTag } from "../..";

const PHOENIXSCANS_DOMAIN = "https://phoenix-scans.pl";

export const PhoenixScansInfo: SourceInfo = {
	version: "1.0.0",
	name: "Phoenix-Scans",
	description: "Extension that pulls manga from phoenix-scans.pl",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: PHOENIXSCANS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Polish",
			type: TagType.GREY,
		},
	],
};

export class PhoenixScans extends Mmrcms {
	baseUrl: string = PHOENIXSCANS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceTraversalPathName: string = "manga";
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Shounen" },
		{ id: "2", name: "Tragedia" },
		{ id: "3", name: "Szkolne życie" },
		{ id: "4", name: "Romans" },
		{ id: "5", name: "Zagadka" },
		{ id: "6", name: "Horror" },
		{ id: "7", name: "Dojrzałe" },
		{ id: "8", name: "Psychologiczne" },
		{ id: "9", name: "Przygodowe" },
		{ id: "10", name: "Akcja" },
		{ id: "11", name: "Komedia" },
		{ id: "12", name: "Zboczone" },
		{ id: "13", name: "Fantasy" },
		{ id: "14", name: "Harem" },
		{ id: "15", name: "Historyczne" },
		{ id: "16", name: "Manhua" },
		{ id: "17", name: "Manhwa" },
		{ id: "18", name: "Sztuki walki" },
		{ id: "19", name: "One shot" },
		{ id: "20", name: "Sci fi" },
		{ id: "21", name: "Seinen" },
		{ id: "22", name: "Shounen ai" },
		{ id: "23", name: "Spokojne życie" },
		{ id: "24", name: "Sport" },
		{ id: "25", name: "Nadprzyrodzone" },
		{ id: "26", name: "Webtoons" },
		{ id: "27", name: "Dramat" },
		{ id: "28", name: "Hentai" },
		{ id: "29", name: "Mecha" },
		{ id: "30", name: "Gender Bender" },
		{ id: "31", name: "Gry" },
		{ id: "32", name: "Yaoi" },
	];
	sourceTags: SourceTag[] = [
		{ id: "aktywne", name: "aktywne" },
		{ id: "zakonczone", name: "zakończone" },
		{ id: "porzucone", name: "porzucone" },
	];
}
