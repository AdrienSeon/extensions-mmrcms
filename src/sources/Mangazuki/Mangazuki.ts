import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../..";

const MANGAZUKI_DOMAIN = "https://mangazuki.co";

export const MangazukiInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangazuki",
	description: "Extension that pulls manga from mangazuki.co",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGAZUKI_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class Mangazuki extends Mmrcms {
	baseUrl: string = MANGAZUKI_DOMAIN;
	languageCode: LanguageCode = LanguageCode.ENGLISH;
	sourceTraversalPathName: string = "manga";
}
