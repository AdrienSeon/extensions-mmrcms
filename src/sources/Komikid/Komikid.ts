import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory } from "../..";

export const KomikidInfo: SourceInfo = {
	version: "1.0.0",
	name: "Komikid",
	description: "Extension that pulls manga from komikid.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://www.komikid.com",
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

export class Komikid extends Mmrcms {
    name: string = KomikidInfo.name;
	baseUrl: string = KomikidInfo.websiteBaseURL;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Action" },
		{ id: "2", name: "Adventure" },
		{ id: "3", name: "Comedy" },
		{ id: "4", name: "Doujinshi" },
		{ id: "5", name: "Drama" },
		{ id: "6", name: "Fantasy" },
		{ id: "7", name: "Gender Bender" },
		{ id: "8", name: "Historical" },
		{ id: "9", name: "Horror" },
		{ id: "10", name: "Josei" },
		{ id: "11", name: "Martial Arts" },
		{ id: "12", name: "Mature" },
		{ id: "13", name: "Mecha" },
		{ id: "14", name: "Mystery" },
		{ id: "15", name: "One Shot" },
		{ id: "16", name: "Psychological" },
		{ id: "17", name: "Romance" },
		{ id: "18", name: "School Life" },
		{ id: "19", name: "Sci-fi" },
		{ id: "20", name: "Seinen" },
		{ id: "21", name: "Shoujo" },
		{ id: "22", name: "Shoujo Ai" },
		{ id: "23", name: "Shounen" },
		{ id: "24", name: "Shounen Ai" },
		{ id: "25", name: "Slice of Life" },
		{ id: "26", name: "Sports" },
		{ id: "27", name: "Supernatural" },
		{ id: "28", name: "Tragedy" },
		{ id: "29", name: "Yaoi" },
		{ id: "30", name: "Yuri" },
	];
}
