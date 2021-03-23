import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const MANGAHANTA_DOMAIN = "http://mangahanta.com";

export const MangaHantaInfo: SourceInfo = {
	version: "1.0.0",
	name: "MangaHanta",
	description: "Extension that pulls manga from mangahanta.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGAHANTA_DOMAIN,
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

export class MangaHanta extends Mmrcms {
	baseUrl: string = MANGAHANTA_DOMAIN;
	languageCode: LanguageCode = LanguageCode.TURKISH;
	sourceTraversalPathName: string = "manga";
}