import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const PUZZMOS_DOMAIN = "https://puzzmos.com";

export const PuzzmosInfo: SourceInfo = {
	version: "1.0.0",
	name: "Puzzmos",
	description: "Extension that pulls manga from puzzmos.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: PUZZMOS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Turkish",
			type: TagType.GREY,
		},
	],
};

export class Puzzmos extends Mmrcms {
	baseUrl: string = PUZZMOS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.TURKISH;
	sourceTraversalPathName: string = "manga";
}