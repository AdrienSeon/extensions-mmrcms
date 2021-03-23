import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../..";

const MANGADOOR_DOMAIN = "https://mangadoor.com";

export const MangadoorInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangadoor",
	description: "Extension that pulls manga from mangadoor.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGADOOR_DOMAIN,
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

export class Mangadoor extends Mmrcms {
	baseUrl: string = MANGADOOR_DOMAIN;
	languageCode: LanguageCode = LanguageCode.SPANISH;
	sourceTraversalPathName: string = "manga";
}
