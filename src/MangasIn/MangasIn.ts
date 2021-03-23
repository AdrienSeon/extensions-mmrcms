import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const MANGASIN_DOMAIN = "https://mangas.in";

export const MangasInInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangas.in",
	description: "Extension that pulls manga from mangas.in",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGASIN_DOMAIN,
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

export class MangasIn extends Mmrcms {
	baseUrl: string = MANGASIN_DOMAIN;
	languageCode: LanguageCode = LanguageCode.SPANISH;
	sourceTraversalPathName: string = "manga";
}