import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, SourceCategory } from "../..";

const HENTAISHARK_DOMAIN = "https://www.hentaishark.com";

export const HentaiSharkInfo: SourceInfo = {
	version: "1.0.0",
	name: "Hentai Shark",
	description: "Extension that pulls manga from hentaishark.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: true,
	websiteBaseURL: HENTAISHARK_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
	],
};

export class HentaiShark extends Mmrcms {
	baseUrl: string = HENTAISHARK_DOMAIN;
	languageCode: LanguageCode = LanguageCode.UNKNOWN;
	sourceTraversalPathName: string = "manga";
	sourceCategories: SourceCategory[] = [
		{ id: "1", name: "Doujinshi" },
		{ id: "2", name: "Manga" },
		{ id: "3", name: "Western" },
		{ id: "4", name: "non-h" },
		{ id: "5", name: "imageset" },
		{ id: "6", name: "artistcg" },
		{ id: "7", name: "misc" },
	];
}
