import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory } from "../..";

export const MangaIdInfo: SourceInfo = {
	version: "1.0.0",
	name: "MangaID",
	description: "Extension that pulls manga from mangaid.click",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://mangaid.click",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Indonesian",
			type: TagType.GREY,
		},
	],
};

export class MangaId extends Mmrcms {
    name: string = MangaIdInfo.name;
	baseUrl: string = MangaIdInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.INDONESIAN;
    latestIsInListFormat: boolean = false;
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Action" },
		{ id: "2", name: "Adventure" },
		{ id: "3", name: "Comedy" },
		{ id: "4", name: "Doujinshi" },
		{ id: "5", name: "Drama" },
		{ id: "6", name: "Ecchi" },
		{ id: "7", name: "Fantasy" },
		{ id: "8", name: "Gender Bender" },
		{ id: "9", name: "Harem" },
		{ id: "10", name: "Historical" },
		{ id: "11", name: "Horror" },
		{ id: "12", name: "Josei" },
		{ id: "13", name: "Martial Arts" },
		{ id: "14", name: "Mature" },
		{ id: "15", name: "Mecha" },
		{ id: "16", name: "Mystery" },
		{ id: "17", name: "Psychological" },
		{ id: "18", name: "Romance" },
		{ id: "19", name: "School Life" },
		{ id: "20", name: "Sci-fi" },
		{ id: "21", name: "Seinen" },
		{ id: "22", name: "Shoujo" },
		{ id: "23", name: "Shoujo Ai" },
		{ id: "24", name: "Shounen" },
		{ id: "25", name: "Shounen Ai" },
		{ id: "26", name: "Slice of Life" },
		{ id: "27", name: "Sports" },
		{ id: "28", name: "Supernatural" },
		{ id: "29", name: "Tragedy" },
		{ id: "30", name: "Yaoi" },
		{ id: "31", name: "Yuri" },
		{ id: "32", name: "School" },
		{ id: "33", name: "Isekai" },
		{ id: "34", name: "Military" },
	];
}
