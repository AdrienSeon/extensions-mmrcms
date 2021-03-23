import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const MANGASYURI_DOMAIN = "https://mangasyuri.net";

export const MangasYuriInfo: SourceInfo = {
	version: "1.0.0",
	name: "Mangas Yuri",
	description: "Extension that pulls manga from mangasyuri.net",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANGASYURI_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Portuguese",
			type: TagType.GREY,
		},
	],
};

export class MangasYuri extends Mmrcms {
	baseUrl: string = MANGASYURI_DOMAIN;
	languageCode: LanguageCode = LanguageCode.PORTUGUESE;
	sourceTraversalPathName: string = "manga";
}