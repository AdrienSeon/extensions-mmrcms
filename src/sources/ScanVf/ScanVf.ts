import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory } from "../..";

const SCANVF_DOMAIN = "https://www.scan-vf.net";

export const ScanVfInfo: SourceInfo = {
	version: "1.0.0",
	name: "Scan-VF",
	description: "Extension that pulls manga from scan-vf.net",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SCANVF_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "French",
			type: TagType.GREY,
		},
	],
};

export class ScanVf extends Mmrcms {
	baseUrl: string = SCANVF_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "";
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
		{ id: "17", name: "One Shot" },
		{ id: "18", name: "Psychological" },
		{ id: "19", name: "Romance" },
		{ id: "20", name: "School Life" },
		{ id: "21", name: "Sci-fi" },
		{ id: "22", name: "Seinen" },
		{ id: "23", name: "Shoujo" },
		{ id: "24", name: "Shoujo Ai" },
		{ id: "25", name: "Shounen" },
		{ id: "26", name: "Shounen Ai" },
		{ id: "27", name: "Slice of Life" },
		{ id: "28", name: "Sports" },
		{ id: "29", name: "Supernatural" },
		{ id: "30", name: "Tragedy" },
		{ id: "31", name: "Yaoi" },
		{ id: "32", name: "Yuri" },
	];
}
