import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory, SourceTag } from "../..";

const SCANOP_DOMAIN = "https://scan-op.cc";

export const ScanOpInfo: SourceInfo = {
	version: "1.0.0",
	name: "Scan-OP",
	description: "Extension that pulls manga from scan-op.cc",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: SCANOP_DOMAIN,
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

export class ScanOp extends Mmrcms {
	baseUrl: string = SCANOP_DOMAIN;
	languageCode: LanguageCode = LanguageCode.FRENCH;
	sourceTraversalPathName: string = "manga";
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Comedy" },
		{ id: "2", name: "Doujinshi" },
		{ id: "3", name: "Drama" },
		{ id: "4", name: "Ecchi" },
		{ id: "5", name: "Fantasy" },
		{ id: "6", name: "Gender Bender" },
		{ id: "7", name: "Josei" },
		{ id: "8", name: "Mature" },
		{ id: "9", name: "Mecha" },
		{ id: "10", name: "Mystery" },
		{ id: "11", name: "One Shot" },
		{ id: "12", name: "Psychological" },
		{ id: "13", name: "Romance" },
		{ id: "14", name: "School Life" },
		{ id: "15", name: "Sci-fi" },
		{ id: "16", name: "Seinen" },
		{ id: "17", name: "Shoujo" },
		{ id: "18", name: "Shoujo Ai" },
		{ id: "19", name: "Shounen" },
		{ id: "20", name: "Shounen Ai" },
		{ id: "21", name: "Slice of Life" },
		{ id: "22", name: "Sports" },
		{ id: "23", name: "Supernatural" },
		{ id: "24", name: "Tragedy" },
		{ id: "25", name: "Yaoi" },
		{ id: "26", name: "Yuri" },
		{ id: "27", name: "Comics" },
		{ id: "28", name: "Autre" },
	];
	sourceTags: SourceTag[] = [{ id: "nouveau", name: "nouveau" }];
}
