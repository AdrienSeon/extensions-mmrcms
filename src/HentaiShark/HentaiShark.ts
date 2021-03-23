import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const HENTAISHARK_DOMAIN = "https://www.hentaishark.com";

export const HentaiSharkInfo: SourceInfo = {
	version: "1.0.0",
	name: "Hentai Shark",
	description: "Extension that pulls manga from hentaishark.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: true,
	websiteBaseURL: HENTAISHARK_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
	],
};

export class HentaiShark extends Mmrcms {
	baseUrl: string = HENTAISHARK_DOMAIN;
	languageCode: LanguageCode = LanguageCode.UNKNOWN;
	sourceTraversalPathName: string = "manga";
}