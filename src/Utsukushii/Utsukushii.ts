import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const UTSUKUSHII_DOMAIN = "https://manga.utsukushii-bg.com";

export const UtsukushiiInfo: SourceInfo = {
	version: "1.0.0",
	name: "Utsukushii",
	description: "Extension that pulls manga from manga.utsukushii-bg.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: UTSUKUSHII_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Russian",
			type: TagType.GREY,
		},
	],
};

export class Utsukushii extends Mmrcms {
	baseUrl: string = UTSUKUSHII_DOMAIN;
	languageCode: LanguageCode = LanguageCode.RUSSIAN;
	sourceTraversalPathName: string = "manga";
}