import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const JPMANGAS_DOMAIN = "https://www.komikid.com";

export const KomikidInfo: SourceInfo = {
	version: "1.0.0",
	name: "Komikid",
	description: "Extension that pulls manga from komikid.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: JPMANGAS_DOMAIN,
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

export class Komikid extends Mmrcms {
	baseUrl: string = JPMANGAS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceTraversalPathName: string = "manga";
}