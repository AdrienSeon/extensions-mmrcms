import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const MANGAID_DOMAIN = "https://mangaid.click";

export const MangaIdInfo: SourceInfo = {
	version: "1.0.0",
	name: "MangaID",
	description: "Extension that pulls manga from mangaid.click",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGAID_DOMAIN,
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

export class MangaId extends Mmrcms {
	baseUrl: string = MANGAID_DOMAIN;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceTraversalPathName: string = "manga";
}