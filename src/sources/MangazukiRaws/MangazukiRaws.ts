import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../..";

const MANGAZUKIRAWS_DOMAIN = "https://raws.mangazuki.co";

export const MangazukiRawsInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangazuki Raws",
	description: "Extension that pulls manga from raws.mangazuki.co",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGAZUKIRAWS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Korean",
			type: TagType.GREY,
		},
		{
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class MangazukiRaws extends Mmrcms {
	baseUrl: string = MANGAZUKIRAWS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.KOREAN;
	sourceTraversalPathName: string = "manga";
}
